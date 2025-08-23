// Type definition for a single car in the fleet
export interface Car {
  class_name: string;
  car_name: string;
  car_comments: string;
}

// Type definition for a station
export interface Station {
  _id: string;
  station_code: string;
  station_name: string;
  latitude: number;
  longitude: number;
  address: string;
  car_fleet: Car[];
  photo_urls: string[];
  disp1MonthReserveLabel: string | null;
  disp3MonthReserveLabel: string | null;
}
