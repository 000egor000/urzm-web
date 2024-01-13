import axios from 'axios';

import { Endpoints } from 'constants/endpoints';
import { useHighchartsStock } from 'utils/hooks/useHighchartsStock';
import useSaveFile from 'utils/hooks/useSaveFile';

import useCumulativeProductionConfig from '../hooks/useCumulativeProductionConfig';
import useDailyDownloadConfig from '../hooks/useDailyDownloadConfig';
import useDailyProductionConfig from '../hooks/useDailyProductionConfig';
import useRationaleTuningIntervalConfig from '../hooks/useRationaleTuningIntervalConfig';
import useConvertSvgToPngFile from 'utils/hooks/useConvertSvgToPngFile';

import {
  columnsForStatistics,
  columnsForTuningInterval,
  columnsForCharacteristics,
  columnsForWellFond,
  titleName,
  fileName,
} from '../DisplacementCharacteristics/constants';

const useDocxExport = ({ chart, dataInit }) => {
  const saveFile = useSaveFile();
  const goToConvertSvg = useConvertSvgToPngFile();

  const { recalculateData, data } = chart;
  const { Highcharts } = useHighchartsStock(['exporting']);
  let content = {};

  const cumulativeProductionConfig = useCumulativeProductionConfig(recalculateData, data);
  const dailyDownloadConfig = useDailyDownloadConfig(recalculateData, data);
  const dailyProductionConfig = useDailyProductionConfig(recalculateData, data);
  const rationaleTuningIntervalConfig = useRationaleTuningIntervalConfig(data);

  if (dataInit && +dataInit?.error?.code === 0) {
    const generation = dataInit
      ? Object.entries(dataInit?.displacement_characteristic_area_stat_map).map(item => {
          return { columns: columnsForStatistics, data: item[1], type: titleName(item[0]) };
        })
      : {};

    content = {
      tables: [
        {
          columns: columnsForTuningInterval,
          data: [
            {
              settings_interval_start: dataInit?.settings_interval?.period_start,
              settings_interval_end: dataInit?.settings_interval?.period_end,
              trend_start: dataInit?.trend.period_start,
              trend_end: dataInit?.trend?.period_end,
              determination_factor: dataInit?.determination_factor,
              trend_months: dataInit?.trend_months,
              ventures_name: dataInit?.group_info?.ventures_name,
              workshop_name: dataInit?.group_info?.workshop_name,
              field_name: dataInit?.group_info?.field_name,
              group_well_name: dataInit?.group_info?.group_well_name,
            },
          ],
          type: 'НГДО',
        },

        {
          columns: columnsForWellFond,
          data: data?.well_fond_fact_list
            ? data?.well_fond_fact_list
            : recalculateData?.well_fond_fact_list,
          type: 'Фактические показатели',
        },
        {
          columns: columnsForWellFond,
          data: data?.well_fond_forecast_list
            ? data?.well_fond_forecast_list
            : recalculateData?.well_fond_forecast_list,
          type: 'Базовые показатели',
        },

        {
          columns: columnsForCharacteristics,

          data: dataInit?.displacement_characteristic_table,
          type: 'Характеристики вытеснения',
        },

        ...generation,
      ],
      type: 'formalization',
    };
  }

  return {
    exportChart: async () => {
      const cumulativeProductionSvg = new Highcharts.Chart(
        document.createElement('div'),
        cumulativeProductionConfig,
      ).getSVG();
      const dailyDownloadSvg = new Highcharts.Chart(
        document.createElement('div'),
        dailyDownloadConfig,
      ).getSVG();
      const dailyProductionSvg = new Highcharts.Chart(
        document.createElement('div'),
        dailyProductionConfig,
      ).getSVG();
      const rationaleTuningIntervalSvg = new Highcharts.Chart(
        document.createElement('div'),
        rationaleTuningIntervalConfig,
      ).getSVG();

      const cumulativeProductionFile = await goToConvertSvg(
        cumulativeProductionSvg,
        'cumulativeProduction',
      );
      const dailyDownloadSvgFile = await goToConvertSvg(dailyDownloadSvg, 'dailyDownload');
      const dailyProductiontFile = await goToConvertSvg(dailyProductionSvg, 'dailyProduction');

      const rationaleTuningIntervalFile = await goToConvertSvg(
        rationaleTuningIntervalSvg,
        'rationaleTuningInterval',
      );

      const formData = new FormData();

      formData.append('content', JSON.stringify(content));
      formData.append('images', rationaleTuningIntervalFile);
      formData.append('images', cumulativeProductionFile);
      formData.append('images', dailyDownloadSvgFile);
      formData.append('images', dailyProductiontFile);

      const docxResponse = await axios.post(Endpoints.excel_tableAndImage(), formData, {
        responseType: 'blob',
      });

      saveFile(fileName, docxResponse);
    },
  };
};

export default useDocxExport;
