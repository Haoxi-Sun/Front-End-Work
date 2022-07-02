import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { zip } from 'lodash';

if (typeof Highcharts === "object") {
  require("highcharts/modules/heatmap")(Highcharts);
  require("highcharts/modules/exporting")(Highcharts);
}

function getPointCategoryName(point, dimension) {
  var series = point.series,
    isY = dimension === "y",
    axis = series[isY ? "yAxis" : "xAxis"];
  return axis.categories[point[isY ? "y" : "x"]];
}

export default function CourseHeat({ data }) {
  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Total",
  ];
  const [options, setOptions] = useState({
    chart: {
      type: "heatmap",
      plotBorderWidth: 1,
    },
    title: {
      text: "Course Schedule Per Weekday",
    },
    xAxis: {
      categories: weekdays,
    },
    credits: {
      enabled: false,
    },
    colorAxis: {
      min: 0,
      minColor: "#FFFFFF",
      maxColor: "#1890ff",
    },
    legend: {
      align: "right",
      layout: "vertical",
      margin: 0,
      verticalAlign: "top",
      y: 25,
      symbolHeight: 280,
    },
    tooltip: {
      formatter: function () {
        return (
          "<b>" +
          getPointCategoryName(this.point, "y") +
          "</b> <br><b>" +
          this.point.value +
          "</b> lessons on <b>" +
          getPointCategoryName(this.point, "x") +
          "</b>"
        );
      },
    },
    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 500,
          },
          chartOptions: {
            yAxis: {
              labels: {
                formatter: function () {
                  return this.value.charAt(0);
                },
              },
            },
          },
        },
      ],
    },
    accessibility: {
      point: {
        descriptionFormatter: function (point) {
          var ix = point.index + 1,
            xName = getPointCategoryName(point, "x"),
            yName = getPointCategoryName(point, "y"),
            val = point.value;
          return ix + ". " + xName + " lessons " + yName + ", " + val + ".";
        },
      },
    },
  });

  useEffect(() => {
    if (!data) return;
    const yCategories = data.map((items) => items.name);
    yCategories.push("Total");

    const rowData = data.map((items) => {
      const countCourse = new Array(8);
      weekdays.forEach((weekday) => {
        countCourse[weekday] = 0;
      });
      countCourse["Total"] = 0;
      const courses = items.courses
        .map((item) => item.classTime)
        .flat()
        .map((item) => item?.split(" ")[0]);

    courses.forEach(item =>{
      const index =  weekdays.find((value) => value === item);
      countCourse[index] += 1;
    });

    let total = 0;
    weekdays.forEach((weekday) => {
        total = total + countCourse[weekday];
    });
    countCourse["Total"] = total;
    return countCourse;
    });

    const sourceData = rowData.map((columnAry, index) => {
        const result = [];
        let i = 0;
        for (i = 0; i<columnAry.length; i++){
            const day = weekdays[i];
            result.push([i, index, columnAry[day]]);
        } 
        return result;
    }).flat();
    console.log(sourceData);
    setOptions({
      yAxis: {
        categories: yCategories,
        title: null,
        reversed: true,
      },
      series: [
        {
          name: 'Lessons per weekday',
          borderWidth: 1,
          data: sourceData,
          dataLabels: {
            enabled: true,
            color: '#000000',
          },
        },
      ],
    });
  }, [data]);
  return <HighchartsReact highcharts={Highcharts} options={options} />;
}
