#!/usr/bin/env python3
"""Compute per-batch and macro mean absolute error from a CSV."""

import argparse
import csv
import json
import math
from statistics import mean

HEADER = ["batch", "observed", "predicted"]


def finite_number(text, column, line):
    try:
        value = float(text)
    except ValueError:
        raise ValueError(f"line {line}: {column} must be a number") from None
    if not math.isfinite(value):
        raise ValueError(f"line {line}: {column} must be finite")
    return value


def summarize_errors(file):
    rows = csv.reader(file, strict=True)
    if next(rows, None) != HEADER:
        raise ValueError(f"expected CSV header: {','.join(HEADER)}")

    errors_by_batch = {}
    for row in rows:
        line = rows.line_num
        if len(row) != len(HEADER):
            raise ValueError(f"line {line}: expected {len(HEADER)} fields")
        batch, observed_text, predicted_text = row
        batch = batch.strip()
        if not batch:
            raise ValueError(f"line {line}: batch must not be blank")
        observed = finite_number(observed_text, "observed", line)
        predicted = finite_number(predicted_text, "predicted", line)
        error = abs(observed - predicted)
        if not math.isfinite(error):
            raise ValueError(f"line {line}: absolute error is too large")
        errors_by_batch.setdefault(batch, []).append(error)

    if not errors_by_batch:
        raise ValueError("CSV must contain at least one observation")
    per_batch = {
        batch: {"count": len(errors), "mae": mean(errors)}
        for batch, errors in sorted(errors_by_batch.items())
    }
    macro_mae = mean(result["mae"] for result in per_batch.values())
    return {"per_batch": per_batch, "macro_mae": macro_mae}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("csv_path", metavar="CSV", help="path to the UTF-8 observations CSV")
    args = parser.parse_args()
    try:
        with open(args.csv_path, encoding="utf-8-sig", newline="") as file:
            result = summarize_errors(file)
    except (OSError, ValueError, csv.Error) as error:
        parser.error(str(error))
    print(json.dumps(result, indent=2, allow_nan=False))


if __name__ == "__main__":
    main()
