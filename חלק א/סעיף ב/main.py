import pandas as pd
import os


# בפונקציות open וsave נשתמש גם בהמשך
def open_by_type_file(file):
    file = str(file)
    if file.endswith('.csv'):
        return pd.read_csv(file)
    elif file.endswith('.parquet'):
        return pd.read_parquet(file)
    else:
        return None


def save_by_type_file(file, name):
    name = str(name)
    if name.endswith('.csv'):
        file.to_csv(name, index=False)
    elif name.endswith('.parquet'):
        file.to_parquet(name)
    else:
        return None


# 1
def checks(file):
    file['timestamp'] = pd.to_datetime(file['timestamp'], errors='coerce')  # בדיקה לפורמט הזמן
    file = file.dropna(subset=['timestamp'], how='any')
    file = file.drop_duplicates(subset=['timestamp', 'value'])  # בדיקת כפולים
    file.loc[:, 'value'] = pd.to_numeric(file['value'], errors='coerce')  # בדיקת ערכים מספריים
    file = file.dropna(subset=['value'], how='any')
    return file


def calculate_avg(file):
    file = checks(file)
    file['hour_date'] = file['timestamp'].dt.strftime('%Y-%m-%d %H')
    avg = file.groupby('hour_date')['value'].mean()
    return avg


# file = pd.read_csv('time_series.csv')
# best_file = checks(file)
# print(calculate_avg(best_file))


# 2
def split_csv(file):
    file = open_by_type_file(file)
    file = checks(file)

    # המרת עמודת ה-timestamp לפורמט datetime אם היא לא כזו
    file['timestamp'] = pd.to_datetime(file['timestamp'], format="%d/%m/%Y %H:%M")

    dates = file['timestamp'].dt.date.unique()
    pathes = []

    for date in dates:
        date_data = file[file['timestamp'].dt.date == date]
        path = f"{date}.csv"
        pathes.append(path)
        date_data.to_csv(path, index=False)

    new_file = pd.DataFrame()

    for item in pathes:
        part_file = open_by_type_file(item)
        part_file = checks(part_file)
        new_file = pd.concat([new_file, part_file], ignore_index=True)
        avg = calculate_avg(part_file)
        print(f"avg for {item}: {avg}")

    new_file.to_csv("time_series2.csv", index=False)


split_csv('time_series.csv')

# סעיף ב/ב/3
"""
אם הנתונים מגיעים בזרימה בזמן אמת, ולא מקובץ, 
בכל פעם שנכנס נתון, נכניס אותו למקום המתאים לו במילון על פי השעה,
נוסיף את הערך שלו לסכום שהיה שם, ונעדכן את הcounter-
בכל פעם שנרצה את הממוצע לשעה מסוימת, ניגש למקום המתאים במילון,
ונשלוף את הנתונים הרצויים.
לא נזדקק לעידכון של כל הנתונים עבור שעה מסוימת.
אם הנתונים מגיעים לפי סדר הזמן, נוכל בכל שעה למחוק את נתוני השעה הקודמת,
שאין לנו צורך בהם, ובכך נחסוך גם מקום
"""

# סעיף ב/ב/4
"""
הקבצים מסוג parquet הם יעילים הרבה יותר כאשר מתעסקים עם כמות גדולה מאד של נתונים,
ולכן נעדיף להשתמש בהם במקרה הזה.
parquet בכל פעם שיש קריאה לקובץ csv, נשנה זאת ל
בראש העמוד כתובות פונקציות לקריאה ושמירה של קבצים על פי סוגם,
כך שאם נשלח קובץ בסיומת parquet, בכל התוכנית הוא יקבל התיחסות ב-parquet
"""
file_csv = "time_series.csv"
file_parquet = "time_series.parquet"
split_csv(open_by_type_file(file_parquet))
