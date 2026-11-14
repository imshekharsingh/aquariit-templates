"""The storytelling starter (14 Nov 2026; owner: "make the content rich in learning and information; people stay engaged if we follow good
and smart storytelling"): python3 techreel/starter.py <slug> [--long]
Writes techreel/topics/<slug>.json in the story look with the beats laid out in order, each with a placeholder line and a shot to fill:
  payoff    the striking ANSWER image in frame 0, said in 7 words or fewer ("Smooth scrolling has a number.")
  question  ONE question the rest answers ("So why does 120 Hz feel faster, with the same chip?")
  step x2-3 one concrete fact each, revealed on its word, with "source" = its index in post.sources (the maker's page or the standard)
  surprise  the thing worth saving: the fact nobody expects, sourced
  takeaway  (optional) what to do with it, the verdict a viewer acts on (rules-tech.md F4)
20 s (default: 2 steps, 50-70 words) or --long 40-45 s (3 steps, 100-140 words). make.py --fake-vo --stills prints STORY and LENGTH
against these rules. Fill every "TODO", pick the shot kinds (techreel/README.md, "The story look"), add the media, then run the stills."""
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))


def shot(kind, move=None, **params):
    s = {'kind': kind, 'params': params}
    if move:
        s['move'] = move
    return s


def main():
    if len(sys.argv) < 2 or sys.argv[1].startswith('-'):
        sys.exit(__doc__)
    slug, long_ = sys.argv[1], '--long' in sys.argv
    path = os.path.join(HERE, 'topics', slug + '.json')
    if os.path.exists(path):
        sys.exit(f'{path} exists; pick another slug')
    steps = 3 if long_ else 2
    lines = [
        {'text': 'TODO the answer in seven words or fewer.', 'beat': 'payoff',
         'scene': shot('hero', draw='phone', screen='feed', h=800, y=960, photo='hero', match=[510, 960],
                       words=[{'text': 'TODO BIG ANSWER', 'accent': True, 'size': 170}])},
        {'text': 'TODO so why does this happen, when you would expect the opposite?', 'beat': 'question',
         'scene': shot('duo', 'match', match=[720, 1010], left={'label': 'TODO A', 'cue': 'TODO'}, right={'label': 'TODO B', 'cue': 'TODO', 'accent': True},
                       words=[{'text': 'TODO QUESTION?', 'cue': 'TODO', 'accent': True}])},
    ]
    kinds = [('strip', 'zoom'), ('clock', 'pan'), ('rate', 'push')]
    for j in range(steps):
        k, mv = kinds[j]
        lines.append({'text': f'TODO step {("one", "two", "three")[j]}: one concrete fact, said plainly, numbers spelled out.', 'beat': 'step', 'source': j,
                      'scene': shot(k, mv, words=[{'text': 'TODO', 'cue': 'TODO', 'accent': True}])})
    lines.append({'text': 'TODO and the surprise: the fact worth saving.', 'beat': 'surprise', 'source': steps,
                  'scene': shot('hero', 'match', draw='phone', h=790, y=990, words=[{'text': 'TODO', 'cue': 'TODO', 'accent': True, 'size': 170}])})
    lines.append({'text': 'TODO what to do with it, in one line.', 'beat': 'takeaway',
                  'scene': shot('hero', 'zoom', draw='phone', h=800, y=975, photo='hero', words=[{'text': 'TODO VERDICT', 'cue': 'TODO', 'accent': True}])})
    topic = {
        'slug': slug, 'topic': 'TODO', 'look': 'story', 'format': 'TODO SPECS DECODED | WORTH IT OR NOT | GADGET MYTHS',
        'audience': 'TODO india | global', 'gadget': 'TODO', 'voice': 'af_heart', 'flow': True, 'speed': 1.0, 'max_speed': 1.0,
        'dur': 42.0 if long_ else 21.0, 'max_end': 41.3 if long_ else 20.4, 'hook_key': 'TODO',
        'lines': lines,
        'media': [{'id': 'hero', 'queries': ['TODO'], 'sources': ['wikimedia', 'openverse'], 'avoid': ['logo', 'person', 'people', 'face'], 'min_side': 1600}],
        'qa': {'sync': ['TODO words the voice says that name big words on screen']},
        'post': {'title': 'TODO', 'caption': 'TODO (credits for every CC BY photo go here: author, licence, source)', 'keywords': ['TODO'],
                 'hashtags': ['#todo1', '#todo2', '#todo3', '#todo4', '#techtips'],
                 'sources': [{'url': 'https://TODO', 'note': 'TODO the maker\'s page or the standard, what it says, date read'} for _ in range(steps + 1)]},
    }
    json.dump(topic, open(path, 'w'), indent=1, ensure_ascii=False)
    open(path, 'a').write('\n')
    print(f'wrote {path} ({"40-45 s, 3 steps" if long_ else "20 s, 2 steps"}); fill every TODO, then: python3 techreel/make.py {slug} --fake-vo --stills 0,2,4')


if __name__ == '__main__':
    main()
