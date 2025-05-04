import matplotlib.pyplot as plt

# Sprint setup
total_days = 5
total_tasks = 10
days = list(range(total_days + 1))
ideal = [total_tasks - (total_tasks / total_days) * d for d in days]

# Simulated actual progress each day
progress_snapshots = [
    [10],                              # Day 0
    [10, 8],                           # Day 1
    [10, 8, 6],                        # Day 2
    [10, 8, 6, 4],                     # Day 3
    [10, 8, 6, 4, 2],                  # Day 4
    [10, 8, 6, 4, 2, 0]               # Day 5
]

# Plot and save each snapshot
for day in range(1, 6):
    plt.figure(figsize=(8, 5))
    plt.plot(days[:day+1], ideal[:day+1], label='Ideal', linestyle='--', color='gray')
    plt.plot(days[:day+1], progress_snapshots[day], label='Actual', marker='o', color='blue')
    plt.title(f"Sprint Burn-Down Chart - Day {day}")
    plt.xlabel("Day")
    plt.ylabel("Remaining Tasks")
    plt.xticks(range(0, 6))
    plt.yticks(range(0, total_tasks+1, 2))
    plt.grid(True)
    plt.legend()
    plt.tight_layout()
    plt.savefig(f"sprint_burndown_day{day}.png")
    plt.close()

print("Burn-down chart snapshots saved as PNG files.")
