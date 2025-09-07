import pandas as pd

df = pd.read_excel("Sheet1.xlsx")  # thay bằng tên file bạn

tong_gio_lam = df["Giờ làm việc"].sum()
tong_tang_ca = df["Giờ tăng ca"].sum()

print("Tổng giờ làm việc:", tong_gio_lam)
print("Tổng giờ tăng ca:", tong_tang_ca)
