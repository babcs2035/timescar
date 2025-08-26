import requests
import time
import json
import re
from pymongo import MongoClient
from pyproj import Transformer, CRS

# --- Settings ---
MONGO_URI = "mongodb://localhost:27017/"
MONGO_DB_NAME = "timescar"
MONGO_COLLECTION_NAME = "stations"

# --- API Endpoints ---
BASE_URL = "https://share.timescar.jp"
STATIONS_URL = f"{BASE_URL}/view/station/teeda.ajax?component=station_stationMapPage&action=ajaxViewMap&minlat=23.4043&maxlat=47.0306&minlon=123.1350&maxlon=149.1116"
DETAIL_URL = f"{BASE_URL}/view/station/teeda.ajax?&component=station_detailPage&action=ajaxStation&scd={{}}"

def convert_zdc_to_leaflet(lon, lat):
    crs_tokyo = CRS("EPSG:4301")
    crs_wgs84 = CRS("EPSG:4326")
    transformer = Transformer.from_crs(crs_tokyo, crs_wgs84, always_xy=True)
    new_lon, new_lat = transformer.transform(lon, lat)
    return new_lat, new_lon

def fetch_and_process_data():
    """Fetches, processes, and saves each Times Car station data to MongoDB."""
    
    client = MongoClient(MONGO_URI)
    db = client[MONGO_DB_NAME]
    collection = db[MONGO_COLLECTION_NAME]
    
    try:
        print("Starting to fetch the station list...")
        response = requests.get(STATIONS_URL)
        response.raise_for_status()
        station_codes = response.json().get("s", [])
        total_stations = len(station_codes)
        print(f"Found a total of {total_stations} stations.")
        
        upsert_count = 0
        
        for i, station in enumerate(station_codes):
            station_code = station.get("cd")
            if not station_code:
                continue

            print(f"[{i+1}/{total_stations}] Processing data for {station_code}...")
            
            # Wait for 1 second to reduce server load
            time.sleep(1) 
            
            try:
                detail_response = requests.get(DETAIL_URL.format(station_code))
                detail_response.raise_for_status()
                station_detail = detail_response.json()
                if station_detail is None:
                    print(f"  → No detail data found for {station_code}, skipping.")
                    continue
                
                photo_urls = []
                for item in station_detail.get("photoImage", []):
                    html_string = item.get("photoChild", "")
                    relative_urls = re.findall(r"href='([^']*)'", html_string)
                    photo_urls.extend([BASE_URL + url for url in relative_urls])

                station_comment = station_detail.get("comment", "").replace("\r<br />", "\n")

                car_fleet = [
                    {
                        "class_name": car.get("carClassName"),
                        "car_name": car.get("carName"),
                        "car_comments": re.sub(r"[\r\n]", "", car.get("carComments", ""))
                    } for car in station_detail.get("carInfo", [])
                ]

                zdc_lat, zdc_lon = float(station.get("la", 0)), float(station.get("lo", 0))
                leaflet_lat, leaflet_lon = convert_zdc_to_leaflet(zdc_lon, zdc_lat)
                combined_data = {
                    "station_code": station_code,
                    "station_name": station.get("nm"),
                    "latitude": leaflet_lat,
                    "longitude": leaflet_lon,
                    "address": station_detail.get("adr1"),
                    "station_comment": station_comment,
                    "car_fleet": car_fleet,
                    "photo_urls": photo_urls,
                    "disp1MonthReserveLabel": station.get("disp1MonthReserveLabel"),
                    "disp3MonthReserveLabel": station.get("disp3MonthReserveLabel"),
                }
                
                result = collection.update_one(
                    {'station_code': station_code},
                    {'$set': combined_data},
                    upsert=True
                )
                
                if result.upserted_id:
                    upsert_count += 1
                    print(f"  → New station inserted: {station_code}")
                else:
                    print(f"  → Station updated: {station_code}")
                    
            except requests.exceptions.RequestException as e:
                print(f"  → Error fetching data for {station_code}: {e}")
                continue

        print(f"\nProcessing complete. Total stations processed: {total_stations}, newly inserted: {upsert_count}")

    except requests.exceptions.RequestException as e:
        print(f"An error occurred while fetching station list: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    fetch_and_process_data()
