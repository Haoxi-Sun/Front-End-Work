import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

export default function Increment({ data }) {
  const [options, setOptions] = useState({
    title: {
      text: '',
    },
    yAxis: {
      title: {
        text: 'Increment',
      },
    },
    accessibility: {
      enable: false,
    },
    xAxis: {
      categories: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ],
    },
    credits: {
      enabled: false,
    },
    exporting: {
      enable: false,
    },
    legend: {
      layout: 'horizontal',
      align: 'center',
      verticalAlign: 'bottom',
    },
    plotOptions: {
      line: {
        animation: false,
      },
    },
    chart: {
      animation: false,
    },
  });

  const currentYear = new Date().getFullYear();

  useEffect(() => {
    if (!data) return;

    const filteredData = Object.entries(data).filter(
      ([_, data]) => !!data && !!data.length
    );

    const currentData = filteredData.map(([name, items]) => ({
      name: name,
      data: items.filter(
        (item) => item.name.split('-')[0] === currentYear.toString()
      ),
    }));

    const series = Object.entries(currentData).map(([_, items]) => ({
      name: Object.values(items)[0],
      data: new Array(12).fill(0).map((_, index) => {
        const month = index + 1;
        const name = month > 9 ? month.toString() : '0' + month.toString();
        const target = Object.values(items)[1].find(
          (element) => element.name.split('-')[1] === name
        );
        if (target === undefined) return 0;
        return target.amount;
      }),
    }));

    setOptions({
      series,
    });
  }, [data]);

  return (
    <>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </>
  );
}
