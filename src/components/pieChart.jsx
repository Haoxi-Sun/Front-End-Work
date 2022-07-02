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
      enabled: false,
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        animation: false,
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
    exporting: {
      enabled: false,
    },
  });

  useEffect(() => {
    if (!data) return;

    const processedTitle = title?.replace(/([A-Z])/g, " $1").trim();
    const processedSubtitle = processedTitle?.split(" ")[0];
    
    const peiSource = data?.map((item) => ({
      name: item.name,
      y: item.amount,
    }));

    const total = peiSource.reduce((a, b) => a + b.y, 0);

    setOptions({
      title: {
        text: `<span style="text-transform: capitalize"}>${processedTitle}</span>`,
      },
      subtitle: {
        text: `${processedSubtitle} total: ${total}`,
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
