#!/usr/bin/env python3
"""Prepare building cooling features and labels from a context/query CSV."""

import argparse
import csv
import json
import math

BASE_TEMPERATURE_C = 18.0
HEADER = ["split", "temperature_c", "occupancy_fraction", "cooling_kwh"]


def finite_number(text, column, line):
    try:
        value = float(text)
    except ValueError:
        raise ValueError(f"line {line}: {column} must be a number") from None
    if not math.isfinite(value):
        raise ValueError(f"line {line}: {column} must be finite")
    return value


def prepare_context(file):
    rows = csv.reader(file, strict=True)
    if next(rows, None) != HEADER:
        raise ValueError(f"expected CSV header: {','.join(HEADER)}")

    context, labels, query = [], [], []
    for row in rows:
        line = rows.line_num
        if len(row) != len(HEADER):
            raise ValueError(f"line {line}: expected {len(HEADER)} fields")
        split, temperature_text, occupancy_text, label_text = row
        if split not in ("context", "query"):
            raise ValueError(f"line {line}: split must be context or query")

        temperature = finite_number(temperature_text, "temperature_c", line)
        occupancy = finite_number(occupancy_text, "occupancy_fraction", line)
        if not 0.0 <= occupancy <= 1.0:
            raise ValueError(f"line {line}: occupancy_fraction must be between 0 and 1")
        features = [max(0.0, temperature - BASE_TEMPERATURE_C), occupancy]

        if split == "context":
            label = finite_number(label_text, "cooling_kwh", line)
            if label < 0.0:
                raise ValueError(f"line {line}: cooling_kwh must be nonnegative")
            context.append(features)
            labels.append(label)
        else:
            if label_text.strip():
                raise ValueError(f"line {line}: leave cooling_kwh blank for query rows")
            query.append(features)

    if not context or not query:
        raise ValueError("CSV must contain at least one context row and one query row")
    return {
        "base_temperature_c": BASE_TEMPERATURE_C,
        "feature_names": ["cooling_degrees_c", "occupancy_fraction"],
        "X_context": context,
        "y_context": labels,
        "X_query": query,
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("csv_path", metavar="CSV", help="path to the UTF-8 readings CSV")
    args = parser.parse_args()
    try:
        with open(args.csv_path, encoding="utf-8-sig", newline="") as file:
            result = prepare_context(file)
    except (OSError, ValueError, csv.Error) as error:
        parser.error(str(error))
    print(json.dumps(result, indent=2, allow_nan=False))


if __name__ == "__main__":
    main()
