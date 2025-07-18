'use client'
import React, {useMemo, useRef} from "react";
import {Bar} from "react-chartjs-2";
import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    ChartOptions,
    Legend,
    LinearScale,
    LogarithmicScale,
    Title,
    Tooltip,
} from "chart.js";
import {Transaction, useDataContext} from "../../../backend/context/DataContext";
import Link from "next/link";
// Register scales including the LogarithmicScale
ChartJS.register(CategoryScale, LinearScale, LogarithmicScale, BarElement, Title, Tooltip, Legend);


const getOptions = (selectedDays: number): ChartOptions<"bar"> => ({
    responsive: true,
    plugins: {
        legend: {position: "top"},
        title: {display: true, text: `Expenses by Category - Last (${selectedDays} days)`},
    },
    scales: {
        y: {
            type: "linear",

            ticks: {
                stepSize: 10,
                callback: (value) => Number(value).toLocaleString(),
            },
        },
    },
});


export const ChartComponent: React.FC = () => {
    const {transactions, selectedDays, setSelectedCategory, selectedCategory} = useDataContext();
    const chartRef = useRef<ChartJS<"bar", number[], string>>(null);

    // Compute chart data, conditionally adjusting colors based on the selected category.
    const computedChartData = useMemo(() => {
        const expenseByCategory: Record<string, number> = {};
        transactions.forEach((tx: Transaction) => {
            if (tx.notes.includes("Returned")) return;
            expenseByCategory[tx.category] = (expenseByCategory[tx.category] || 0) + tx.amount;
        });

        // Convert each category's total to absolute value.
        for (const category in expenseByCategory) {
            expenseByCategory[category] = Math.abs(expenseByCategory[category]);
        }

        const categories = Object.keys(expenseByCategory).filter(
            (cat) => expenseByCategory[cat] > 0 && cat.toLowerCase() !== "transfers" && cat.toLowerCase() !== "income"
        );

        // Define original colors.
        const baseColors = [
            "rgba(75,192,192,0.2)",
            "rgba(255,99,132,0.2)",
            "rgba(54,162,235,0.2)",
            "rgba(255,206,86,0.2)",
            "rgba(153,102,255,0.2)",
            "rgba(255,159,64,0.2)",
        ];
        const baseBorderColors = [
            "rgb(75,192,192)",
            "rgb(255,99,132)",
            "rgb(54,162,235)",
            "rgb(255,206,86)",
            "rgb(153,102,255)",
            "rgb(255,159,64)",
        ];

        // Define monotone (grey) colors for unselected categories.
        const monotoneBg = "rgba(200,200,200,0.2)";
        const monotoneBorder = "rgb(200,200,200)";

        const datasets = categories.map((cat, i) => {
            let bgColor = baseColors[i % baseColors.length];
            let borderColor = baseBorderColors[i % baseBorderColors.length];
            if (selectedCategory) {
                if (cat.trim().toLowerCase() !== selectedCategory) {
                    bgColor = monotoneBg;
                    borderColor = monotoneBorder;
                }
            }
            return {
                label: cat,
                data: [expenseByCategory[cat]],
                backgroundColor: bgColor,
                borderColor: borderColor,
                borderWidth: 1,
                barPercentage: 1.0,
                categoryPercentage: 1.0,
            };
        });

        return {
            labels: ["Expenses"],
            datasets,
        };
    }, [transactions, selectedCategory]);

    const handleClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
        const chart = chartRef.current;
        if (!chart) return;
        const elements = chart.getElementsAtEventForMode(event.nativeEvent, "nearest", {intersect: true}, true);
        if (elements.length > 0) {
            const datasetIndex = elements[0].datasetIndex;
            const clickedCategory = (computedChartData.datasets[datasetIndex].label as string)
                .trim()
                .toLowerCase();
            console.log(clickedCategory);

            if (selectedCategory === clickedCategory) {
                setSelectedCategory(null);
            } else {
                setSelectedCategory(clickedCategory);
            }
        }
    };

    return (
        <Link
            href={"/Analytics/Spending"}
            className="bg-white rounded-lg border border-[#E0E0E0] hover:shadow-xl col-span-6 xl:col-span-4 p-4 flex-1 flex-grow h-full w-full"
        >
            <Bar
                ref={chartRef}
                options={getOptions(selectedDays)}
                data={computedChartData}
                onClick={handleClick}
                className="w-full h-full"
            />
        </Link>
    );
};

export default ChartComponent;
