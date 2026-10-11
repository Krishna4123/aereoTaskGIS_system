export function formatBytes(bytes: number, decimals: number = 1): string {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function formatArea(ha?: number): string {
  if (ha === undefined || ha === null) return '—';
  return `${ha.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ha`;
}

export function formatLength(meters?: number): string {
  if (meters === undefined || meters === null) return '—';
  if (meters >= 1000) {
    return `${(meters / 1000).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} km`;
  }
  return `${meters.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} m`;
}

export function formatNumber(num: number): string {
  return num.toLocaleString('en-US');
}

export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}
