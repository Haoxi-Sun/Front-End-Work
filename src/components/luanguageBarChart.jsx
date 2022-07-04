import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

export default function LanguagesBarChart({ data }) {
  const [options, setOptions] = useState({
    chart: {
      type: "column",
    },
    title: {
      text: "Student VS Teacher",
    },
    subtitle: {
      text: "Comparing what students are interested in and teachers' skills",
    },
    yAxis: {
      min: 0,
      title: {
        text: "Interested VS Skills",
      },
    },
    legend: {
      enabled: true,
    },
    credits: {
      enabled: false,
    },
    plotOptions: {
      column: {
        plotOptions: {
          column: {
            dataLabels: {
              enabled: true,
            },
          },
        },
      },
    },
    exporting: {
      enabled: false,
    },
    tooltip: {
      formatter: function () {
        return this.series.name === "Interest"
          ? this.series.name + ": " + this.y
          : this.x +
              "<br />" +
              this.series.name +
              ": " +
              this.y +
              "<br/>" +
              "Total: " +
              this.point.stackTotal;
      },
    },
  });

  const getLevel = (value) => {
    if (value === 1) {
      return "Know";
    } else if (value === 2) {
      return "Practiced";
    } else if (value === 3) {
      return "Comprehend";
    } else if (value === 4) {
      return "Expert";
    } else {
      return "Master";
    }
  };

  useEffect(() => {
    
    if (!data || Object.values(data).some((item) => item === undefined)) return;

    const { student, teacher } = data;

    const categories = [
      ...new Set([
        ...Object.keys(teacher),
        ...student.map((item) => item.name),
      ]),
    ];

    const studentBar = categories.reduce(
      (currentList, languagesList) => {
        const target = student.find((item) => item.name === languagesList);
        currentList.data.push(target ? target.amount : 0);
        return currentList;
      },
      { name: "Interest", stack: "interest", data: [] }
    );

    const levels = [
      ...new Set(
        Object.values(teacher)
          .flat()
          .map((item) => item.level)
      ),
    ].sort();

    const teacherBar = levels.map((level) => ({
      name: getLevel(level),
      data: categories.map(
        (item) =>
          teacher[item]?.find((element) => element.level === level)?.amount || 0
      ),
      stack: "teacher",
      stacking: "normal",
    }));

    setOptions({
      xAxis: {
        type: "category",
        labels: {
          rotation: -45,
        },
        categories: categories,
      },
      series: [...teacherBar, studentBar],
    });
  }, [data]);
  return <HighchartsReact highcharts={Highcharts} options={options} />;
}
