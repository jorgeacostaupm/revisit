import os
import glob
import json


def flatten_components(components):
    """Flatten nested components into a list of names."""
    flat = []

    def recurse(c):
        if isinstance(c, str):
            flat.append(c)
        elif isinstance(c, dict):
            if "components" in c:
                for ic in c["components"]:
                    recurse(ic)
            elif "id" in c:
                flat.append(c["id"])

    for c in components:
        recurse(c)
    return flat


def clean_participant(participant):
    """Keep only answers after training_ends, drop tasks_end,
    remove provenanceGraph/windowEvents, and use componentName as key (last one kept).
    """
    seq = participant.get("sequence", {})
    comps = seq.get("components", [])
    flat = flatten_components(comps)

    # get all tasks after "training_ends"
    try:
        idx = flat.index("training_ends")
        comps_after = flat[idx + 1 :]
    except ValueError:
        comps_after = flat[:]  # if no training_ends, keep all

    # remove tasks_end if present
    comps_after = [c for c in comps_after if c != "tasks_end"]

    answers = participant.get("answers", {})
    new_answers = {}

    for trial in answers.values():
        cname = trial.get("componentName")
        if cname in comps_after:
            # copy trial without provenanceGraph / windowEvents
            trial_copy = {
                k: v
                for k, v in trial.items()
                if k not in ("provenanceGraph", "windowEvents")
            }
            # overwrite if cname already exists (keep last)
            new_answers[cname] = trial_copy

    cleaned = dict(participant)
    cleaned["answers"] = new_answers
    return cleaned


def load_all_jsons(input_dir):
    """Load all participants from all .json files in a directory."""
    all_participants = []
    json_files = glob.glob(os.path.join(input_dir, "*.json"))
    print(f"Found {len(json_files)} JSON files in {input_dir}")
    for path in json_files:
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
            if isinstance(data, list):
                all_participants.extend(data)
            else:
                print(f"⚠️ {path} is not a list of participants, skipped")
    print(f"Total participants combined: {len(all_participants)}")
    return all_participants


from sklearn.metrics import f1_score


def compute_f1(pred, true):
    # Convertir a sets para manejar respuestas desordenadas
    pred_set = set(pred)
    true_set = set(true)

    if not pred_set and not true_set:
        return 1.0  # Si ambos están vacíos, F1 perfecta
    if not pred_set or not true_set:
        return 0.0  # Si uno está vacío, F1 = 0

    tp = len(pred_set & true_set)
    precision = tp / len(pred_set)
    recall = tp / len(true_set)

    if precision + recall == 0:
        return 0.0
    return 2 * (precision * recall) / (precision + recall)


def compute_accuracy(task, answer_data):
    # -------------------
    # Cluster tasks
    # -------------------
    if task in [
        "cluster_mean",
        "cluster_var",
        "cluster_mean_extra",
        "cluster_var_extra",
    ]:
        pred = answer_data["answer"].get("cluster", None)
        correct = answer_data.get("correctAnswer", [])
        if correct and "answer" in correct[0]:
            true = correct[0]["answer"]
            return 1.0 if pred == true else 0.0
        else:
            return None

    # -------------------
    # Classification tasks
    # -------------------
    elif task == "classification":
        pred_dict = answer_data["answer"].get("stability", {})
        correct_classification = {
            "Oregon": "Medium Price Variation",
            "Utah": "High Price Variation",
            "Illinois": "Low Price Variation",
        }
        correct_count = 0
        for node, correct_value in correct_classification.items():
            if node in pred_dict and pred_dict[node] == correct_value:
                correct_count += 1
        return correct_count / len(correct_classification)

    elif task == "classification_extra":
        pred_dict = answer_data["answer"].get("stability", {})
        correct_classification_extra = {
            "Minnesota": "High Prices Variation",
            "Pennsylvania": "Medium Prices Variation",
            "Texas": "Low Prices Variation",
        }
        correct_count = 0
        for node, correct_value in correct_classification_extra.items():
            if node in pred_dict and pred_dict[node] == correct_value:
                correct_count += 1
        return correct_count / len(correct_classification_extra)

    # -------------------
    # Path tasks (exact match)
    # -------------------
    elif task in ["path_mean", "path_var", "path_mean_extra", "path_var_extra"]:
        pred_path = answer_data["answer"].get("path", "")
        correct = answer_data.get("correctAnswer", [])
        if correct:
            true_path = (
                correct[0]["answer"] if isinstance(correct[0]["answer"], str) else ""
            )
            return 1.0 if pred_path == true_path else 0.0
        else:
            return None

    else:
        return None
