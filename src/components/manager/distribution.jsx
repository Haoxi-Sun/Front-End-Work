import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts/highmaps';
import HighchartsReact from 'highcharts-react-official';
import { getWorld } from '../../api/api';

export default function Distribution({ title, data }) {
  const [options, setOptions] = useState({
    colorAxis: {
      min: 0,
      stops: [
        [0, '#EFEFFF'],
        [0.5, Highcharts.getOptions().colors[0]],
        [
          1,
          Highcharts.color(Highcharts.getOptions().colors[0])
            .brighten(-0.5)
            .get(),
        ],
      ],
    },

    legend: {
      layout: 'vertical',
      align: 'left',
      verticalAlign: 'bottom',
    },
    credits: {
      enabled: false,
    },
    accessibility: {
      enabled: false,
    },
    chart: {
      animation: false,
    },
  });

  const [world, setWorld] = useState();

  useEffect(() => {
    (async () => {
      const res = await getWorld();
      setWorld(res.data);
      setOptions({ series: [{ mapData: res.data }] });
    })();
  }, []);

  useEffect(() => {
    if (!data || !world) return;

    const mapSource = data?.map((item) => {
      const target = world.features?.find(
        (features) =>
          item.name.toLowerCase() === features.properties?.name.toLowerCase()
      );
      return !!target
        ? {
            'hc-key': target.properties['hc-key'],
            value: item.amount,
          }
        : {};
    });

    const options = {
      title: {
        text: `<span style="text-transform: capitalize">${title}</span>`,
      },
      series: [
        {
          data: mapSource,
          mapData: world,
          name: 'Total',
          states: {
            hover: {
              color: '#BADA55',
            },
          },
        },
      ],
    };
    setOptions(options);
  }, [data, world]);
  return (
    <HighchartsReact
      highcharts={Highcharts}
      constructorType={'mapChart'}
      options={options}
    />
  );
}
