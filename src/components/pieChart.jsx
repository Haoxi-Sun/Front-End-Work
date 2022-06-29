import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import PieChart from "highcharts-react-official";

export default function Pie({ data, title }) {
  const [options, setOptions] = useState({
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: "pie",
    },
    tooltip: {
      pointFormat:
        "{series.name}: <b>{point.percentage:.1f}%</b> <br> total: {point.y}",
    },
    accessibility: {
      point: {
        valueSuffix: "%",
      },
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: true,
          format: "<b>{point.name}</b>: {point.percentage:.1f} %",
        },
      },
    },
    credits: {
      enabled: false,
    },
  });

  useEffect(() => {
    if (!data) return;
    const processedTitle = title?.replace(/([A-Z])/g, " $1").trim();
    const peiSource = data?.map((item) => ({
      name: item.name,
      y: item.amount,
    }));
    setOptions({
      title: {
        text: `<span style="text-transform: capitalize"}>${processedTitle}</span>`,
      },
      series: [
        {
          name: "percentage",
          colorByPoint: true,
          data: peiSource,
        },
      ],
    });
  }, [data]);
  return <PieChart highcharts={Highcharts} options={options} />;
}
