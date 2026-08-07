#!/usr/bin/env python3

"""Compatibility entry point for the shared Node.js chapter audit."""

from __future__ import annotations

import os
import sys
from pathlib import Path


def main() -> None:
    script = Path(__file__).with_name("audit-chapter-headings.js")
    os.execvp("node", ["node", str(script), *sys.argv[1:]])


if __name__ == "__main__":
    main()
