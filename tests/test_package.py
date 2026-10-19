"""Static checks for the Bushin Browser skill plugin (no Discord credentials)."""
import json
import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

class BushinPackageTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.manifest = json.loads((ROOT / 'plugin.json').read_text(encoding='utf-8'))
        cls.codex_manifest = json.loads((ROOT / '.codex-plugin/plugin.json').read_text(encoding='utf-8'))

    def test_original_identity_is_preserved(self):
        self.assertEqual(self.manifest['name'], 'bushin-browser')
        self.assertTrue(re.fullmatch(r'\d+\.\d+\.\d+', self.manifest['version']))
        self.assertEqual(self.codex_manifest['name'], self.manifest['name'])
        self.assertEqual(self.codex_manifest['version'], self.manifest['version'])

    def test_skills_present_and_have_metadata(self):
        skills = sorted((ROOT / 'skills').glob('*/SKILL.md'))
        self.assertGreaterEqual(len(skills), 1, 'No Bushin skills found')
        for path in skills:
            with self.subTest(path=str(path.relative_to(ROOT))):
                content = path.read_text(encoding='utf-8')
                self.assertTrue(content.startswith('---\n'), 'Missing YAML frontmatter')
                header = content.split('---', 2)[1]
                self.assertRegex(header, r'(?m)^name:\s*\S+')
                self.assertRegex(header, r'(?m)^description:\s*\S+')

    def test_referenced_skills_directory(self):
        self.assertEqual(self.manifest.get('skills'), './skills')
        self.assertTrue((ROOT / 'skills').is_dir())

    def test_no_local_only_mcp_config(self):
        for local in ('.mcp.json', 'mcp.json'):
            self.assertFalse((ROOT / local).exists(), f'Unexpected desktop-only config: {local}')

    def test_no_obvious_committed_credentials(self):
        dangerous = re.compile(r'(?:gh[pousr]_[A-Za-z0-9]{20,}|sk-[A-Za-z0-9]{32,}|\b(?:DISCORD_TOKEN|GITHUB_TOKEN|CLIENT_SECRET)\s*=\s*[\x22\x27]?[A-Za-z0-9_\-]{30,})')
        for path in [ROOT / 'plugin.json', ROOT / '.codex-plugin/plugin.json', *(ROOT / 'skills').rglob('*.md')]:
            with self.subTest(file=str(path.relative_to(ROOT))):
                self.assertIsNone(dangerous.search(path.read_text(encoding='utf-8')))

if __name__ == '__main__':
    unittest.main()
