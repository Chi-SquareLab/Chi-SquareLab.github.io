window.TUTORIALS = {
  domain: {
    title: "Evaluating Domain Adaptation on Tabular Data",
    intro:
      "Can a model trained at one site predict cooling demand at a warmer site, and do a few labeled examples from the new site help? This walkthrough uses simulated data. Use Python 3.10+ and run: python -m pip install tabpfn==9.0.0 numpy scikit-learn. On first use, sign in with Prior Labs and accept the TabPFN-3.5 model license to download the weights. Without a browser, accept the license in your Prior Labs account and set TABPFN_TOKEN.",
    sections: [
      {
        title: "Simulate a change in the inputs",
        text: "The source and target sites share the same demand formula and noise distribution. Temperatures are usually higher at the target site, so the inputs become more or less common while demand at a given temperature and occupancy follows the same rule. This is covariate shift.",
        code: `import numpy as np
from sklearn.metrics import mean_absolute_error
from tabpfn import TabPFNRegressor

rng = np.random.default_rng(7)


def sample_site(n, mean_temperature):
    temperature = rng.normal(mean_temperature, 4, n)
    occupancy = rng.uniform(0, 1, n)
    cooling_degrees = np.maximum(temperature - 18, 0)
    demand = (
        2 + 0.3 * cooling_degrees + 1.5 * occupancy
        + 0.12 * cooling_degrees * occupancy + rng.normal(0, 0.3, n)
    )
    return np.column_stack([temperature, occupancy]), demand


X_source, y_source = sample_site(180, 22)
X_source_test, y_source_test = sample_site(100, 22)
X_adapt, y_adapt = sample_site(60, 29)
X_target_test, y_target_test = sample_site(100, 29)
`,
      },
      {
        title: "Compare three ways to use the labels",
        text: "Use the same TabPFN configuration with source labels only, target labels only, or both pooled. The target-only and pooled fits get the same 60 target labels. Score every fit on the same untouched target rows and check the source-only fit on a separate source test set. Lower mean absolute error (MAE) is better.",
        code: `training_sets = {
    "Source only": (X_source, y_source),
    "Target only": (X_adapt, y_adapt),
    "Pooled": (np.vstack([X_source, X_adapt]), np.r_[y_source, y_adapt]),
}

for name, (X_fit, y_fit) in training_sets.items():
    model = TabPFNRegressor()
    model.fit(X_fit, y_fit)
    target_mae = mean_absolute_error(y_target_test, model.predict(X_target_test))
    print(f"{name}: target MAE = {target_mae:.3f}")
    if name == "Source only":
        source_mae = mean_absolute_error(y_source_test, model.predict(X_source_test))
        print(f"{name}: source MAE = {source_mae:.3f}")
`,
      },
      {
        title: "Read the comparisons",
        text: "Compare the source-only model's two test errors to see how its error changes across sites. On the target, compare pooled with source only to gauge the value of adding target labels, and pooled with target only to gauge the value of adding source data at the same target label budget. Total training sizes differ. These comparisons describe this simulation; for a real deployment, repeat the design across target sites and reserve separate target validation data for tuning.",
      },
    ],
    sources: [
      {
        label: "Prior Labs: TabPFN 9.0.0 API and weight access",
        url: "https://github.com/PriorLabs/TabPFN/tree/v9.0.0",
      },
      {
        label: "Sugiyama et al. (2007): Covariate shift",
        url: "https://www.jmlr.org/papers/v8/sugiyama07a.html",
      },
      {
        label: "Daumé (2007): Source-only, target-only, and pooled baselines",
        url: "https://aclanthology.org/P07-1033/",
      },
    ],
  },
  statistics: {
    title: "Split Conformal Intervals with TabPFN",
    intro:
      "How can you turn a point prediction into a range for a future sensor reading? Use simulated data to build a 90% prediction interval. Use Python 3.10+ and run: python -m pip install tabpfn==9.0.0 numpy. On first use, sign in with Prior Labs and accept the TabPFN-3.5 model license to download the weights. Without a browser, accept the license in your Prior Labs account and set TABPFN_TOKEN.",
    sections: [
      {
        title: "Fit once and keep the model fixed",
        text: "Generate independent readings from one simulator. Use separate rows to fit the model, calibrate interval widths, and check coverage. Fit TabPFN on the first part only and leave it fixed for the remaining steps.",
        code: `from math import ceil

import numpy as np
from tabpfn import TabPFNRegressor

rng = np.random.default_rng(12)
X = rng.uniform(-2, 2, size=(460, 2))
signal = np.sin(2 * X[:, 0]) + 0.7 * X[:, 1]
noise_sd = 0.15 + 0.15 * np.abs(X[:, 0])
y = signal + rng.normal(0, noise_sd)

X_fit, X_cal, X_test = np.split(X, [180, 320])
y_fit, y_cal, y_test = np.split(y, [180, 320])
model = TabPFNRegressor()
model.fit(X_fit, y_fit)
`,
      },
      {
        title: "Calibrate an interval radius",
        text: "Score each calibration row by its absolute prediction error. Use the kth smallest error, where k is the ceiling of (n + 1) times (1 − alpha) and n is the number of calibration rows. The extra count gives the finite sample correction. If k exceeds n, the construction returns an unbounded interval.",
        code: `alpha = 0.10
scores = np.abs(y_cal - model.predict(X_cal))
n = len(scores)
k = ceil((n + 1) * (1 - alpha))
radius = np.sort(scores)[k - 1] if k <= n else np.inf
`,
      },
      {
        title: "Measure coverage and width",
        text: "Add and subtract the same radius from each test prediction. Coverage counts how often the realized reading falls inside its interval; mean width measures how wide those intervals are.",
        code: `center = model.predict(X_test)
lower, upper = center - radius, center + radius
coverage = np.mean((lower <= y_test) & (y_test <= upper))
print(f"Nominal coverage: {1 - alpha:.0%}")
print(f"Test coverage: {coverage:.1%}")
print(f"Mean interval width: {np.mean(upper - lower):.3f}")
`,
      },
      {
        title: "Interpret the 90% target",
        text: "When calibration rows and a future row are exchangeable, as with independent draws from this simulator, coverage is at least 90% on average over calibration sets and future rows. A single test set can land above or below 90%, and coverage can vary across feature ranges. Here the noise grows with the first feature's magnitude, even though interval width stays constant.",
      },
    ],
    sources: [
      {
        label: "Prior Labs: TabPFN 9.0.0 API and weight access",
        url: "https://github.com/PriorLabs/TabPFN/tree/v9.0.0",
      },
      {
        label:
          "Lei et al. (2018): Distribution-Free Predictive Inference for Regression",
        url: "https://arxiv.org/abs/1604.04173",
      },
    ],
  },
  science: {
    title: "Testing Generalization to New Experimental Batches",
    intro:
      "Can process settings predict material strength for a batch the model has never seen? Use simulated batches to design the evaluation. Use Python 3.10+ and run: python -m pip install tabpfn==9.0.0 numpy scikit-learn. On first use, sign in with Prior Labs and accept the TabPFN-3.5 model license to download the weights. Without a browser, accept the license in your Prior Labs account and set TABPFN_TOKEN.",
    sections: [
      {
        title: "Simulate measurements within batches",
        text: "Temperature and cure time are the predictors. Each batch also has a hidden offset that shifts all of its strength measurements. Keep the batch ID for splitting and reporting; new batches have no known offset at prediction time.",
        code: `import numpy as np
from sklearn.metrics import mean_absolute_error
from sklearn.model_selection import GroupKFold
from tabpfn import TabPFNRegressor

rng = np.random.default_rng(23)
n_batches, rows_per_batch = 9, 24
batch = np.repeat(np.arange(n_batches), rows_per_batch)
n = len(batch)
temperature = rng.uniform(140, 180, n)
cure_minutes = rng.uniform(10, 30, n)
X = np.column_stack([temperature, cure_minutes])
batch_offset = rng.normal(0, 1, n_batches)
y = (
    25 + 0.18 * (temperature - 160) - 0.05 * (cure_minutes - 20) ** 2
    + batch_offset[batch] + rng.normal(0, 0.4, n)
)
`,
      },
      {
        title: "Hold out whole batches",
        text: "GroupKFold keeps each batch together and tests it once. Fit a fresh TabPFN model in each fold. Compare it with a constant prediction equal to the median strength of the training rows in that fold.",
        code: `splitter = GroupKFold(n_splits=3)
pred = np.empty_like(y)
baseline = np.empty_like(y)

for train, test in splitter.split(X, y, groups=batch):
    assert set(batch[train]).isdisjoint(batch[test])
    model = TabPFNRegressor()
    model.fit(X[train], y[train])
    pred[test] = model.predict(X[test])
    baseline[test] = np.median(y[train])
`,
      },
      {
        title: "Score each batch separately",
        text: "Compute the mean absolute error (MAE) for each batch, then average those scores with equal weight per batch. This also lets you see which batches were harder to predict.",
        code: `model_errors, baseline_errors = [], []
for b in np.unique(batch):
    rows = batch == b
    model_mae = mean_absolute_error(y[rows], pred[rows])
    baseline_mae = mean_absolute_error(y[rows], baseline[rows])
    model_errors.append(model_mae)
    baseline_errors.append(baseline_mae)
    print(f"Batch {b}: TabPFN MAE = {model_mae:.3f}, median MAE = {baseline_mae:.3f}")

print(f"Mean batch MAE, TabPFN: {np.mean(model_errors):.3f}")
print(f"Mean batch MAE, median: {np.mean(baseline_errors):.3f}")
`,
      },
      {
        title: "Interpret performance on new batches",
        text: "Lower model error than the median baseline would show predictive value from the settings in this simulation. A random row split can put measurements from the same batch on both sides, which answers a different question about more observations from familiar batches. Real experimental claims need measurements from independent batches that match the intended use.",
      },
    ],
    sources: [
      {
        label: "Prior Labs: TabPFN 9.0.0 API and weight access",
        url: "https://github.com/PriorLabs/TabPFN/tree/v9.0.0",
      },
      {
        label: "Roberts et al. (2017): Cross-validation for structured data",
        url: "https://doi.org/10.1111/ecog.02881",
      },
      {
        label: "scikit-learn: GroupKFold API",
        url: "https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.GroupKFold.html",
      },
    ],
  },
};
