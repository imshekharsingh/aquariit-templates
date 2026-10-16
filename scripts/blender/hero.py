# Blender pilot (owner, 15-16 Oct 2026): one glossy 3D hero shot per reel, path-traced (Cycles) for true glass, reflections and soft shadows.
# Runs ONLY on GitHub (.github/workflows/blender-pilot.yml), never in a Claude session.
#   blender -b -P scripts/blender/hero.py -- --out DIR --frames 1,48,96 [--res 540] [--samples 64]
# The shot (4 s at 24 fps = 96 frames): a glass edge node (hexagonal prism, bevelled) descends onto a dark mirror floor, a lime core lights up inside it,
# a thin brushed-metal ring settles around it; studio softboxes and a cool rim light; navy ground fading to black.
import sys, math, os
import bpy
from mathutils import Vector

argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
def opt(name, default):
    return argv[argv.index(name) + 1] if name in argv else default
OUT = opt('--out', '/tmp/hero'); FRAMES = opt('--frames', '1,48,96'); RES = int(opt('--res', '540')); SAMPLES = int(opt('--samples', '64'))
os.makedirs(OUT, exist_ok=True)

bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
sc.render.engine = 'CYCLES'; sc.cycles.device = 'CPU'; sc.cycles.samples = SAMPLES
OIDN = bool(getattr(bpy.app.build_options, 'openimagedenoise', False))   # distro builds (Ubuntu's apt blender) ship without it
sc.cycles.use_denoising = OIDN
if OIDN: sc.cycles.denoiser = 'OPENIMAGEDENOISE'
else: sc.cycles.samples = max(SAMPLES, 256)                              # no denoiser: more samples instead
print('Blender', bpy.app.version_string, '| denoiser:', 'OIDN' if OIDN else 'none', '| samples:', sc.cycles.samples, flush=True)
sc.cycles.max_bounces = 10; sc.cycles.transmission_bounces = 10; sc.cycles.glossy_bounces = 6; sc.cycles.caustics_reflective = False; sc.cycles.caustics_refractive = False
sc.render.resolution_x = RES; sc.render.resolution_y = int(RES * 16 / 9); sc.render.resolution_percentage = 100
sc.render.image_settings.file_format = 'PNG'; sc.render.film_transparent = False
sc.view_settings.view_transform = 'AgX' if 'AgX' in [i.identifier for i in sc.view_settings.bl_rna.properties['view_transform'].enum_items] else 'Filmic'
try: sc.view_settings.look = 'AgX - Medium High Contrast' if sc.view_settings.view_transform == 'AgX' else 'Medium High Contrast'
except Exception: pass
sc.frame_start, sc.frame_end, sc.render.fps = 1, 96, 24

# ---- world: deep navy, very dim (the softboxes do the lighting) ----
w = bpy.data.worlds.new('W'); sc.world = w; w.use_nodes = True
bg = w.node_tree.nodes['Background']; bg.inputs[0].default_value = (0.006, 0.010, 0.030, 1); bg.inputs[1].default_value = 1.0

def mat(name):
    m = bpy.data.materials.new(name); m.use_nodes = True; return m, m.node_tree.nodes['Principled BSDF']
def setp(p, key, val):
    for k in ([key] if isinstance(key, str) else key):
        if k in p.inputs: p.inputs[k].default_value = val; return

# ---- floor: dark glossy mirror that fades out ----
bpy.ops.mesh.primitive_plane_add(size=60, location=(0, 0, 0)); floor = bpy.context.object
fm, fp = mat('Floor'); setp(fp, 'Base Color', (0.01, 0.014, 0.03, 1)); setp(fp, 'Metallic', 0.6); setp(fp, 'Roughness', 0.12)
floor.data.materials.append(fm)

# ---- the glass node: bevelled hexagonal prism ----
bpy.ops.mesh.primitive_cylinder_add(vertices=6, radius=1.0, depth=0.55, location=(0, 0, 0.275)); node = bpy.context.object; node.name = 'Node'
bev = node.modifiers.new('bev', 'BEVEL'); bev.width = 0.06; bev.segments = 4; bev.limit_method = 'ANGLE'
bpy.ops.object.shade_smooth()
try: bpy.ops.object.shade_auto_smooth()                      # Blender 4.1+
except Exception:
    try: node.data.use_auto_smooth = True                     # Blender <= 4.0
    except Exception: pass
gm, gp = mat('Glass'); setp(gp, 'Base Color', (0.82, 0.88, 1.0, 1)); setp(gp, ['Transmission Weight', 'Transmission'], 1.0); setp(gp, 'Roughness', 0.04); setp(gp, 'IOR', 1.47)
setp(gp, ['Coat Weight', 'Clearcoat'], 0.6)
node.data.materials.append(gm)

# ---- lime core inside the glass ----
bpy.ops.mesh.primitive_uv_sphere_add(radius=0.16, location=(0, 0, 0.3)); core = bpy.context.object; core.name = 'Core'
cm = bpy.data.materials.new('Core'); cm.use_nodes = True; nt = cm.node_tree; nt.nodes.clear()
em = nt.nodes.new('ShaderNodeEmission'); em.inputs[0].default_value = (0.78, 0.96, 0.2, 1); em.inputs[1].default_value = 0.0
out = nt.nodes.new('ShaderNodeOutputMaterial'); nt.links.new(em.outputs[0], out.inputs[0]); core.data.materials.append(cm)
core.parent = node; core.location = (0, 0, 0.025)

# ---- brushed-metal ring ----
bpy.ops.mesh.primitive_torus_add(major_radius=1.35, minor_radius=0.025, location=(0, 0, 0.03)); ring = bpy.context.object; ring.name = 'Ring'
rm, rp = mat('Ring'); setp(rp, 'Base Color', (0.85, 0.88, 0.95, 1)); setp(rp, 'Metallic', 1.0); setp(rp, 'Roughness', 0.22); ring.data.materials.append(rm)

# ---- studio: large soft key above, a cool rim behind, a thin strip on the right for a long highlight on the glass ----
def area(name, loc, rot, size, energy, color, shape='RECTANGLE', size_y=None):
    d = bpy.data.lights.new(name, 'AREA'); d.energy = energy; d.color = color; d.shape = shape; d.size = size
    if size_y: d.size_y = size_y
    o = bpy.data.objects.new(name, d); o.location = loc; o.rotation_euler = rot; sc.collection.objects.link(o); return o
area('Key', (0, -1.5, 6), (math.radians(15), 0, 0), 4, 900, (1, 1, 1))
area('Rim', (0, 5, 2.4), (math.radians(-70), 0, 0), 6, 700, (0.55, 0.65, 1.0), size_y=1.2)
area('Strip', (4.5, -0.5, 2.2), (0, math.radians(65), 0), 0.35, 450, (1, 1, 1), size_y=4)
area('Fill', (-5, -3, 2), (math.radians(60), 0, math.radians(-55)), 3, 120, (0.6, 0.7, 1.0))

# ---- camera: 9:16, a slow arc while the node lands ----
cam_d = bpy.data.cameras.new('Cam'); cam_d.lens = 50; cam = bpy.data.objects.new('Cam', cam_d); sc.collection.objects.link(cam); sc.camera = cam
tgt = bpy.data.objects.new('Tgt', None); tgt.location = (0, 0, 0.35); sc.collection.objects.link(tgt)
tr = cam.constraints.new('TRACK_TO'); tr.target = tgt; tr.track_axis = 'TRACK_NEGATIVE_Z'; tr.up_axis = 'UP_Y'
cam_d.dof.use_dof = True; cam_d.dof.focus_object = tgt; cam_d.dof.aperture_fstop = 2.8

# ---- animation (keyframes; Bezier easing = calm long tails) ----
def key(obj, f, **kw):
    for k, v in kw.items(): setattr(obj, k, v); obj.keyframe_insert(data_path=k, frame=f)
for f, z, rz in [(1, 2.6, 0.0), (60, 0.0, math.radians(70)), (96, 0.0, math.radians(84))]:
    key(node, f, location=Vector((0, 0, 0.275 + z)), rotation_euler=Vector((0, 0, rz)))
for f, s in [(1, 1.6), (62, 1.6), (84, 1.0), (96, 1.0)]:
    key(ring, f, scale=Vector((s, s, s)))
for f, a, r, h in [(1, -0.35, 9.0, 3.2), (96, 0.25, 6.6, 2.0)]:
    key(cam, f, location=Vector((math.sin(a) * r, -math.cos(a) * r, h)))
em.inputs[1].keyframe_insert('default_value', frame=58); em.inputs[1].default_value = 25.0; em.inputs[1].keyframe_insert('default_value', frame=70)

frames = list(range(1, 97)) if FRAMES == 'all' else [int(x) for x in FRAMES.split(',')]
for f in frames:
    sc.frame_set(f); sc.render.filepath = os.path.join(OUT, f'hero-{f:03d}.png'); bpy.ops.render.render(write_still=True)
    print('rendered frame', f, flush=True)
