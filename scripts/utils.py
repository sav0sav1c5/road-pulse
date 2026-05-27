import os
import json
import pandas as pd
from datetime import datetime
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score

def load_info(df):
    print(f'Shape: {df.shape}')
    print(f'Columns: {df.columns.to_list()}')
    print(f'Number of coumnts: {len(df.columns)}')
    print(f'Target distribution: {round(df['accident_type'].value_counts(normalize=True), 3)}')

def split_info(X_train, X_test, y_train, y_test):
    print(f'Rows number (Train): {X_train.shape[0]}')
    print(f'Rows number (Test): {X_test.shape[0]}')
    print(f'Target distribution (Train): {round(y_train.value_counts(normalize=True), 3).to_dict()}')
    print(f'Target distribution (Test): {round(y_test.value_counts(normalize=True), 3).to_dict()}')

def eval_model(model_name, y_test, y_pred, y_pred_prob, target_names):
    """
    Calculates all metrics and returns them as a dictionary.
    """

    report = classification_report(y_test, y_pred, target_names=target_names, output_dict=True)
    matrix = confusion_matrix(y_test, y_pred)
    roc_auc = roc_auc_score(y_test, y_pred_prob)

    results = {
        'model': model_name,
        'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M'),
        'accuracy': round(report['accuracy'], 3),

        'precision_0': round(report[target_names[0]]['precision'], 4),
        'recall_0': round(report[target_names[0]]['recall'], 4),
        'f1_0': round(report[target_names[0]]['f1-score'], 4),

        'precision_1': round(report[target_names[1]]['precision'], 4),
        'recall_1': round(report[target_names[1]]['recall'], 4),
        'f1_1': round(report[target_names[1]]['f1-score'], 4),

        'macro_f1':       round(report['macro avg']['f1-score'], 4),
        'weighted_f1':    round(report['weighted avg']['f1-score'], 4),
        
        'roc_auc':        round(roc_auc, 4),

        'confusion_matrix': json.dumps(matrix.tolist())
    }

    return results

def print_report(y_test, y_pred, results, target_names):
    """
    Prints classsification report from results dictionary.
    """

    print('=' * 55)
    print(f'{results['model']}')
    print('=' * 55)

    print(classification_report(y_test, y_pred, target_names=target_names))

    print(f'ROC-AUC value: {results['roc_auc']}')

def save_results(results, path='../results/model_results.csv'):
    """
    Add new results of model in CSV.
    Update results if model already exists.
    """

    os.makedirs(os.path.dirname(path), exist_ok=True)

    data_new = pd.DataFrame([results])

    if os.path.exists(path):
        data_existing = pd.read_csv(path)

        data_existing[data_existing['model'] != results['model']]
        data_combined = pd.concat([data_existing, data_new], ignore_index=True)
    else:
        data_combined = data_new

    data_combined.to_csv(path, index=False)

def load_results(path='../results/model_results.csv'):
    """
    Loads all results and returns a DataFrame.
    """

    if not os.path.exists(path):
        print("No exsisting results.")
        return None
    
    results = pd.read_csv(path)

    return results