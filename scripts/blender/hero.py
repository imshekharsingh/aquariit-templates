# Blender pilot (owner, 15-16 Oct 2026): one glossy 3D hero shot per reel, path-traced (Cycles) for true glass, reflections and soft shadows.
# Runs ONLY on GitHub (.github/workflows/blender-pilot.yml), never in a Claude session.
#   blender -b -P scripts/blender/hero.py -- --out DIR --frames 1,36,72|all [--res 720] [--samples 24] [--chunk 0 --of 1]
# The shot (3 s at 24 fps = 72 frames): a glass edge node (bevelled hexagonal prism) descends onto a seamless studio sweep, a lime core lights up
# inside it, a thin brushed-metal ring settles around it; a blue glow rises on the sweep behind it so the glass has light to bend.
# Pass 2 (16 Oct): seamless cyclorama instead of a floor plane (no horizon line), low hero camera that follows the node, bigger subject,
# core never black; speed: 24 samples + OIDN + adaptive sampling, fewer bounces, 720 px rendered and upscaled to 1080 in the workflow.
import sys, math, os
import bpy, bmesh
from mathutils import Vector

argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
def opt(name, default):
    return argv[argv.index(name) + 1] if name in argv else default
OUT = opt('--out', '/tmp/hero'); FRAMES = opt('--frames', '1,36,72'); RES = int(opt('--res', '720')); SAMPLES = int(opt('--samples', '24'))
CHUNK = int(opt('--chunk', '0')); OF = int(opt('--of', '1'))
FE = 72
os.makedirs(OUT, exist_ok=True)

bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
sc.render.engine = 'CYCLES'; sc.cycles.device = 'CPU'; sc.cycles.samples = SAMPLES
OIDN = bool(getattr(bpy.app.build_options, 'openimagedenoise', False))   # distro builds (Ubuntu's apt blender) ship without it
sc.cycles.use_denoising = OIDN
if OIDN: sc.cycles.denoiser = 'OPENIMAGEDENOISE'
else: sc.cycles.samples = max(SAMPLES, 256)                              # no denoiser: more samples instead
sc.cycles.use_adaptive_sampling = True; sc.cycles.adaptive_threshold = 0.02
sc.cycles.max_bounces = 8; sc.cycles.transmission_bounces = 8; sc.cycles.glossy_bounces = 4; sc.cycles.diffuse_bounces = 2
sc.cycles.caustics_reflective = False; sc.cycles.caustics_refractive = False; sc.cycles.blur_glossy = 1.0
sc.render.use_persistent_data = True
print('Blender', bpy.app.version_string, '| denoiser:', 'OIDN' if OIDN else 'none', '| samples:', sc.cycles.samples, '| res:', RES, flush=True)
sc.render.resolution_x = RES; sc.render.resolution_y = int(RES * 16 / 9); sc.render.resolution_percentage = 100
sc.render.image_settings.file_format = 'PNG'; sc.render.film_transparent = False
sc.view_settings.view_transform = 'AgX' if 'AgX' in [i.identifier for i in sc.view_settings.bl_rna.properties['view_transform'].enum_items] else 'Filmic'
try: sc.view_settings.look = 'AgX - Medium High Contrast' if sc.view_settings.view_transform == 'AgX' else 'Medium High Contrast'
except Exception: pass
sc.frame_start, sc.frame_end, sc.render.fps = 1, FE, 24

# ---- world: near black navy (the sweep and the softboxes do the lighting) ----
w = bpy.data.worlds.new('W'); sc.world = w; w.use_nodes = True
bg = w.node_tree.nodes['Background']; bg.inputs[0].default_value = (0.004, 0.007, 0.02, 1); bg.inputs[1].default_value = 1.0

def mat(name):
    m = bpy.data.materials.new(name); m.use_nodes = True; return m, m.node_tree.nodes['Principled BSDF']
def setp(p, key, val):
    for k in ([key] if isinstance(key, str) else key):
        if k in p.inputs: p.inputs[k].default_value = val; return

# ---- seamless studio sweep (cyclorama): floor curving up into a back wall, so there is no horizon line ----
def sweep(width=60, front=-30, bend_at=2.5, radius=5.0, height=30, steps=24):
    prof = [(front, 0.0), (bend_at, 0.0)]
    for i in range(1, steps + 1):
        a = math.pi / 2 * i / steps; prof.append((bend_at + radius * math.sin(a), radius - radius * math.cos(a)))
    prof.append((bend_at + radius, height))
    me = bpy.data.meshes.new('Sweep'); bm = bmesh.new()
    L = [bm.verts.new((-width / 2, y, z)) for y, z in prof]; R = [bm.verts.new((width / 2, y, z)) for y, z in prof]
    for i in range(len(prof) - 1): bm.faces.new((L[i], R[i], R[i + 1], L[i + 1]))
    bm.to_mesh(me); bm.free()
    for p in me.polygons: p.use_smooth = True
    o = bpy.data.objects.new('Sweep', me); sc.collection.objects.link(o); return o
cyc = sweep()
fm, fp = mat('Sweep'); setp(fp, 'Base Color', (0.018, 0.028, 0.07, 1)); setp(fp, 'Metallic', 0.0); setp(fp, 'Roughness', 0.16)
setp(fp, ['Specular IOR Level', 'Specular'], 0.6)
cyc.data.materials.append(fm)

# ---- the glass node: bevelled hexagonal prism, taller than pass 1 so it has more faces to bend light ----
NODE_Z = 0.42
bpy.ops.mesh.primitive_cylinder_add(vertices=6, radius=1.0, depth=0.84, location=(0, 0, NODE_Z)); node = bpy.context.object; node.name = 'Node'
bev = node.modifiers.new('bev', 'BEVEL'); bev.width = 0.07; bev.segments = 5; bev.limit_method = 'ANGLE'
bpy.ops.object.shade_smooth()
try: bpy.ops.object.shade_auto_smooth()                      # Blender 4.1+
except Exception:
    try: node.data.use_auto_smooth = True                     # Blender <= 4.0
    except Exception: pass
gm, gp = mat('Glass'); setp(gp, 'Base Color', (0.86, 0.92, 1.0, 1)); setp(gp, ['Transmission Weight', 'Transmission'], 1.0); setp(gp, 'Roughness', 0.03); setp(gp, 'IOR', 1.45)
setp(gp, ['Coat Weight', 'Clearcoat'], 0.5)
node.data.materials.append(gm)

# ---- lime core inside the glass: always faintly lit (pass 1 showed a black dot before it lit) ----
bpy.ops.mesh.primitive_uv_sphere_add(radius=0.24, segments=48, ring_count=24, location=(0, 0, NODE_Z)); core = bpy.context.object; core.name = 'Core'
bpy.ops.object.shade_smooth()
cm = bpy.data.materials.new('Core'); cm.use_nodes = True; nt = cm.node_tree; nt.nodes.clear()
em = nt.nodes.new('ShaderNodeEmission'); em.inputs[0].default_value = (0.72, 1.0, 0.16, 1); em.inputs[1].default_value = 1.5
out = nt.nodes.new('ShaderNodeOutputMaterial'); nt.links.new(em.outputs[0], out.inputs[0]); core.data.materials.append(cm)
core.parent = node; core.location = (0, 0, 0)

# ---- brushed-metal ring ----
bpy.ops.mesh.primitive_torus_add(major_radius=1.42, minor_radius=0.028, major_segments=96, minor_segments=16, location=(0, 0, 0.03)); ring = bpy.context.object; ring.name = 'Ring'
bpy.ops.object.shade_smooth()
rm, rp = mat('Ring'); setp(rp, 'Base Color', (0.86, 0.89, 0.96, 1)); setp(rp, 'Metallic', 1.0); setp(rp, 'Roughness', 0.2); ring.data.materials.append(rm)

# ---- studio: soft key above, blue glow washing up the sweep behind the node (the graded background the glass bends), cool rim, a long strip ----
def area(name, loc, rot, size, energy, color, size_y=None):
    d = bpy.data.lights.new(name, 'AREA'); d.energy = energy; d.color = color; d.shape = 'RECTANGLE'; d.size = size; d.size_y = size_y or size
    o = bpy.data.objects.new(name, d); o.location = loc; o.rotation_euler = rot; sc.collection.objects.link(o)
    try: o.visible_camera = False                             # the softboxes light and reflect, but the camera never sees the panels themselves
    except Exception: pass
    return o
area('Key', (0, -1.2, 5.5), (math.radians(12), 0, 0), 3.5, 700, (1, 1, 1))
area('Glow', (0, 3.2, 0.25), (math.radians(80), 0, 0), 7, 2200, (0.32, 0.5, 1.0), size_y=1.0)      # aims at the sweep's curve and wall
area('Rim', (0, 4.5, 3.0), (math.radians(-60), 0, 0), 5, 500, (0.6, 0.72, 1.0), size_y=1.0)
area('Strip', (4.2, -0.8, 1.6), (0, math.radians(70), 0), 0.3, 380, (1, 1, 1), size_y=3.5)
area('Fill', (-4.5, -3, 1.6), (math.radians(65), 0, math.radians(-55)), 3, 90, (0.6, 0.7, 1.0))

# ---- camera: 9:16, low hero angle, follows the node down, slow arc ----
cam_d = bpy.data.cameras.new('Cam'); cam_d.lens = 50; cam = bpy.data.objects.new('Cam', cam_d); sc.collection.objects.link(cam); sc.camera = cam
tgt = bpy.data.objects.new('Tgt', None); sc.collection.objects.link(tgt)
tr = cam.constraints.new('TRACK_TO'); tr.target = tgt; tr.track_axis = 'TRACK_NEGATIVE_Z'; tr.up_axis = 'UP_Y'
cam_d.dof.use_dof = True; cam_d.dof.focus_object = tgt; cam_d.dof.aperture_fstop = 3.2

# ---- animation (keyframes; Bezier easing = calm long tails) ----
def key(obj, f, **kw):
    for k, v in kw.items(): setattr(obj, k, v); obj.keyframe_insert(data_path=k, frame=f)
for f, z, rz in [(1, 1.5, 0.0), (44, 0.0, math.radians(64)), (FE, 0.0, math.radians(78))]:
    key(node, f, location=Vector((0, 0, NODE_Z + z)), rotation_euler=Vector((0, 0, rz)))
    key(tgt, f, location=Vector((0, 0, 0.42 + 0.55 * z)))
for f, s in [(1, 1.7), (44, 1.7), (62, 1.0), (FE, 1.0)]:
    key(ring, f, scale=Vector((s, s, s)))
for f, a, r, h in [(1, -0.32, 8.4, 1.5), (FE, 0.22, 6.4, 0.95)]:
    key(cam, f, location=Vector((math.sin(a) * r, -math.cos(a) * r, h)))
em.inputs[1].keyframe_insert('default_value', frame=42); em.inputs[1].default_value = 28.0; em.inputs[1].keyframe_insert('default_value', frame=52)

frames = list(range(1, FE + 1)) if FRAMES == 'all' else [int(x) for x in FRAMES.split(',')]
frames = [f for i, f in enumerate(frames) if i % OF == CHUNK]
for f in frames:
    sc.frame_set(f); sc.render.filepath = os.path.join(OUT, f'hero-{f:03d}.png'); bpy.ops.render.render(write_still=True)
    print('rendered frame', f, flush=True)
