CREATE TABLE public.dem_foco_100 (
  rid SERIAL primary key, rast raster
);

-- Select an area within 30km of Colorado State University
INSERT INTO dem_foco_100(rast)
SELECT rast
FROM gdem_100
WHERE ST_Intersects(
  ST_Envelope(rast)  -- Raster tile bounding box
, ST_Envelope(       -- Get a bouding box
    ST_Buffer(       -- Of a buffer
      ST_SetSRID(    -- Of a point in downtown FOCO
        ST_MakePoint(-105.085670, 40.572171)
        , 4326)::geography  -- Note the use of the geography type
      , 30000)::geometry)   -- The buffer radius is 10,000m. We
                            -- convert back to geom to get BB.
);

-- Constrain and index rasters to improve query speed
SELECT AddRasterConstraints(
  'dem_foco_100'::name,  -- table
  'rast'::name  -- raster geometry column
);
CREATE INDEX foco_dem_100_gist_idx
ON dem_foco_100
USING GIST(ST_ConvexHull(rast));





CREATE TABLE public.slope_foco_100 (
  rid SERIAL primary key, rast raster
);

EXPLAIN ANALYZE
INSERT INTO slope_foco_100(rast)
SELECT ST_Slope(
  rast,
  1,              -- Band
  '32BF',         -- Pixel Type
  'DEGRESS',      -- Slope units
  111120,         -- Scale (convert Lon/Lat to Meters)
  FALSE::boolean  -- Interpolate nodata?
)
FROM dem_foco_100
WHERE ST_Intersects(
  ST_Envelope(rast)
, ST_Envelope(
    ST_Buffer(ST_SetSRID(ST_MakePoint(-105.085670, 40.572171), 4326)::geography
      , 10000)::geometry)
);


---------------
-- RESULTS of EXPLAIN ANALYZE
--
-- Insert on slope_foco_100  (cost=0.00..166.36 rows=38 width=27) (actual time=21270.648..21270.648 rows=0 loops=1)
--    ->  Seq Scan on dem_foco_100  (cost=0.00..166.36 rows=38 width=27) (actual time=311.055..21150.972 rows=77 loops=1)
--          Filter: ((st_envelope(rast) && 'buffer'::geometry))
--          Rows Removed by Filter: 490
--  Planning time: 1.944 ms
--  Execution time: 21270.803 ms
--
---------------
SELECT AddRasterConstraints(
  'slope_foco_100'::name,  -- table
  'rast'::name  -- raster geometry column
);

CREATE INDEX slope_foco_100_gist_idx
ON slope_foco_100
USING GIST(ST_ConvexHull(rast));





CREATE TABLE public.slope_good_100 (
  rid SERIAL primary key, rast raster
);

EXPLAIN ANALYZE
INSERT INTO slope_good_100(rast)
SELECT ST_Slope(ST_Union(rast), 1, '32BF', 'DEGRESS', 111120, FALSE)
FROM dem_foco_100
WHERE ST_Intersects(
  ST_Envelope(rast)
, ST_Envelope(
    ST_Buffer(ST_SetSRID(ST_MakePoint(-105.085670, 40.572171), 4326)::geography
      , 10000)::geometry)
);

---------------
-- RESULTS of EXPLAIN ANALYZE
--
-- Insert on slope_good_100  (cost=156.77..157.04 rows=1 width=32) (actual time=21424.041..21424.041 rows=0 loops=1)
--    ->  Subquery Scan on "*SELECT*"  (cost=156.77..157.04 rows=1 width=32) (actual time=21297.699..21298.070 rows=1 loops=1)
--          ->  Aggregate  (cost=156.77..157.03 rows=1 width=27) (actual time=21297.599..21297.600 rows=1 loops=1)
--                ->  Seq Scan on dem_foco_100  (cost=0.00..156.67 rows=38 width=27) (actual time=9.867..40.337 rows=77 loops=1)
--                      Filter: ((st_envelope(rast) && 'buffer'::geometry))
--                      Rows Removed by Filter: 490
--  Planning time: 1.871 ms
--  Execution time: 21425.160 ms
--
---------------

SELECT AddRasterConstraints(
  'slope_good_100'::name,  -- table
  'rast'::name  -- raster geometry column
);

CREATE INDEX slope_good_100_gist_idx
ON slope_good_100
USING GIST(ST_ConvexHull(rast));
