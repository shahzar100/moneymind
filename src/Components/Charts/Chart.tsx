"use client";
import React, {useMemo, useRef} from "react";
import {Bar} from "react-chartjs-2";
import {
    ActiveElement,
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    ChartData,
    Legend,
    LinearScale,
    Title,
    Tooltip,
} from "chart.js";
import Link from 'next/link'
import {Transaction, useDataContext} from "../../../backend/context/DataContext";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const getOptions = (selectedDays: number) => ({
    responsive: true,
    plugins: {
        legend: { position: "top" as const },
        title: { display: true, text: `Expenses by Category - Last ( ${selectedDays} days )` },
    },
});

export const ChartComponent: React.FC = () => {
    const {transactions, setSelectedCategory,selectedDays} = useDataContext();
    const chartRef = useRef<ChartJS<"bar", number[], string>>(null);

    // Compute chart data from the transactions (which are prefiltered by date).
    const computedChartData: ChartData<"bar", number[], string> = useMemo(() => {
        const expenseByCategory: Record<string, number> = {};
        transactions.forEach((tx: Transaction) => {
            expenseByCategory[tx.category] = (expenseByCategory[tx.category] || 0) + tx.amount;
        });
        const categories = Object.keys(expenseByCategory);

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

        const datasets = categories
            .filter((cat) => cat.toLowerCase() !== "transfers" && cat.toLowerCase() !== 'income')
            .map((cat, i) => ({
                label: cat,
                data: [expenseByCategory[cat]],
                backgroundColor: baseColors[i % baseColors.length],
                borderColor: baseBorderColors[i % baseBorderColors.length],
                borderWidth: 1,
                barPercentage: 1.0,
                categoryPercentage: 1.0,
            }));
        return {
            labels: ["Expenses"],
            datasets,
        };
    }, [transactions]);

    // Handle click events on bars to set the selected category.
    const handleClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
        const chart = chartRef.current;
        if (!chart) return;
        const elements: ActiveElement[] = chart.getElementsAtEventForMode(
            event.nativeEvent,
            "nearest",
            {intersect: true},
            true
        );
        if (elements.length > 0) {
            const datasetIndex = elements[0].datasetIndex;
            const clickedCategory = (computedChartData.datasets[datasetIndex].label as string)
                .trim()
                .toLowerCase();
            console.log("Clicked Category:", clickedCategory);
            setSelectedCategory(clickedCategory);
        }
    };

    return (
        <div className="h-full bg-gray-100 col-span-4 p-4 rounded-md">
            <Link href={'/Analytics/Spending'} className={'flex justify-end'}> View Full Analytics </Link>
            <Bar ref={chartRef} options={getOptions(selectedDays)} data={computedChartData} onClick={handleClick}/>
        </div>
    );
};
