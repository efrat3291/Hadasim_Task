import glob
from heapdict import heapdict

my_dic = {}
my_heap = heapdict()
size = 1000


def update_error_count(num_error):
    my_dic[num_error] = my_dic.get(num_error, 0) + 1
    # עדכון בערימה לפי ספירה שלילית (כדי להפוך למקסימום)
    my_heap[num_error] = -my_dic[num_error]


def process_chunk(file, start_line, end_line):
    with open(file, "r", errors="ignore") as f:
        for i, line in enumerate(f):
            if i < start_line:
                continue
            if i >= end_line:
                break
            if "Error:" in line:
                num_error = line.split("Error:")[1].split('"')[0].strip()
                update_error_count(num_error)


# עיבוד הקובץ
for log_file in glob.glob('log.txt'):
    with open(log_file, 'r') as f:
        total_lines = sum(1 for _ in f)

    for start_line in range(0, total_lines, size):
        end_line = min(start_line + size, total_lines)
        process_chunk(log_file, start_line, end_line)

# שליפת N השגיאות הכי נפוצות
n = int(input("Enter n : "))
for _ in range(n):
    if my_heap:
        num_error, negative_count = my_heap.popitem()
        print(f"Error: {num_error}, Count: {-negative_count}")


"""
סיבוכיות הפיתרון הכולל:
O(L + NlogM)
כאשר:
L = מספר השורות בקובץ
N = מספר השגיאות המבוקשות 
M = מספר השגיאות היחודיות בקובץ 

נימוק:
מעבר על כל שורות הקובץ עבור בדיקת השגיאות- O(L),
עדכון ערימה- לערימה בגודל מספר השגיאות היחודיות M, עלות כל הכנסה היא  O(Log M),
שליפת N שגיאות מבוקשות- עלות כל שליפה היא  O(Log M) ונכפיל במספר השליפות N ,
סה"כO(L + NlogM)=  O(L) +  O(N *Log M)
"""