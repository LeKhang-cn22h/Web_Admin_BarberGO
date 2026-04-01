export const BARBER_STATUS = {
  ACTIVE: true,
  INACTIVE: false
}

export const DAYS_OF_WEEK = [
  { label: 'Thứ Hai',  value: 'Monday'    },
  { label: 'Thứ Ba',   value: 'Tuesday'   },
  { label: 'Thứ Tư',   value: 'Wednesday' },
  { label: 'Thứ Năm',  value: 'Thursday'  },
  { label: 'Thứ Sáu',  value: 'Friday'    },
  { label: 'Thứ Bảy',  value: 'Saturday'  },
  { label: 'Chủ Nhật', value: 'Sunday'    }
]

export const DEFAULT_WORKING_DAYS = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
]

export const SERVICE_DURATION_OPTIONS = [
  { label: '15 phút', value: 15  },
  { label: '30 phút', value: 30  },
  { label: '45 phút', value: 45  },
  { label: '1 giờ',   value: 60  },
  { label: '1.5 giờ', value: 90  },
  { label: '2 giờ',   value: 120 }
]

export const IMAGE_UPLOAD_CONFIG = {
  MAX_SIZE:            5 * 1024 * 1024, // 5MB
  ACCEPTED_TYPES:      ['image/jpeg', 'image/png', 'image/webp'],
  ACCEPTED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp']
}

// ============================================================
// API ENDPOINTS
// ============================================================

const BARBERS  = '/barbers'
const SERVICES = '/services'

export const BARBER_API_ENDPOINTS = {
  BASE:         BARBERS,
  BY_ID:        (id)       => `${BARBERS}/${id}`,
  TOP:                        `${BARBERS}/top`,
  STATS:                      `${BARBERS}/stats`,
  LOCATION:     (id)       => `${BARBERS}/${id}/location`,
  UPLOAD_IMAGE: (id)       => `${BARBERS}/${id}/upload-image`,
  DEACTIVATE:   (id)       => `${BARBERS}/${id}/deactivate`,
  ACTIVATE:     (id)       => `${BARBERS}/${id}/active`,
}

export const SERVICE_API_ENDPOINTS = {
  BASE:          SERVICES,
  BY_ID:         (id)       => `${SERVICES}/${id}`,
  BY_BARBER:     (barberId) => `${SERVICES}/barber/${barberId}`,
  TOGGLE_STATUS: (id)       => `${SERVICES}/${id}/toggle-status`
}