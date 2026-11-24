"""Run the two published teaching scripts with their documented inputs after building."""

import json
import re
import subprocess
import sys
from pathlib import Path
from tempfile import TemporaryDirectory

ROOT = Path(__file__).resolve().parents[1]


def fenced(text, language):
    match = re.search(rf"^```{language}\n(.*?)\n```$", text, re.MULTILINE | re.DOTALL)
    if match is None:
        raise ValueError(f"missing {language} example")
    return match.group(1)


def verify(demo):
    doc = (ROOT / f"src/content/docs/products/{demo}.mdx").read_text(encoding="utf-8")
    with TemporaryDirectory() as folder:
        sample = Path(folder) / "input.csv"
        sample.write_text(fenced(doc, "csv") + "\n", encoding="utf-8")
        result = subprocess.run(
            [sys.executable, str(ROOT / f"dist/demos/{demo}.py"), str(sample)],
            capture_output=True, text=True, check=True,
        )
    try:
        actual = json.loads(result.stdout)
        expected = json.loads(fenced(doc, "json"))
    except json.JSONDecodeError as error:
        raise ValueError(f"{demo}: invalid JSON in script output or tutorial: {error}") from error
    if actual != expected:
        raise ValueError(f"{demo}: published output differs from tutorial")
    print(f"{demo}: documented input reproduced expected output")


if __name__ == "__main__":
    for product in ("cooling-context", "batch-error"):
        verify(product)
