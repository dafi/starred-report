export function datasetMatchesSettings(meta, settings) {
  if (!meta) {
    return false
  }

  return meta.owner === settings.owner && meta.repo === settings.repo
}

export function hasUsableDataset(meta, settings, records) {
  return datasetMatchesSettings(meta, settings) && Array.isArray(records) && records.length > 0
}
