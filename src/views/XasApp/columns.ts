export const columns = [
  {
    name: 'Material ID',
    selector: 'task_id',
    format: 'LINK',
    formatArg: '/materials/',
    minWidth: '150px',
  },
  {
    name: 'Formula',
    selector: 'formula_pretty',
    format: 'FORMULA',
  },
  {
    name: 'Absorbing Element',
    selector: 'absorbing_element',
  },
  {
    name: 'Edge',
    selector: 'edge',
  },
  {
    name: 'Spectrum Type',
    selector: 'spectrum_type',
  },
  {
    name: 'xas_id',
    selector: 'xas_id',
  },
  {
    name: 'xas_ids',
    selector: 'xas_ids',
  },
  {
    name: 'spectrum',
    selector: 'spectrum',
    hidden: true,
  },
];