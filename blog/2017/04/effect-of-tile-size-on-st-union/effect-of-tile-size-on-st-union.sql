--
---
-----  Create 100x100 test table
---
--
CREATE TABLE public.gdem_test_100 (
  rid SERIAL primary key, rast raster
);

-- Select an area within 30km of Colorado State University
INSERT INTO gdem_test_100(rast)
SELECT rast
FROM gdem_100
WHERE ST_Intersects(
  ST_Envelope(rast)  -- Raster tile bounding box
, ST_Envelope(       -- Get a bouding box
    ST_Buffer(       -- Of a buffer
      ST_SetSRID(    -- Of a point in downtown FOCO
        ST_MakePoint(-105.085670, 40.572171)
        , 4326)::geography  -- Note the use of the geography type
      , 30000)::geometry)   -- The buffer radius is 30,000m
                            -- We convert back to geom to get BB
);

-- Constrain and index rasters to improve query speed
SELECT AddRasterConstraints(
  'gdem_test_100'::name,  -- table
  'rast'::name  -- raster geometry column
);
CREATE INDEX gdem_test_100_gist_idx
ON gdem_test_100
USING GIST(ST_ConvexHull(rast));





--
---
-----  Create 500x500 test table
---
--
CREATE TABLE public.gdem_test_500 (
  rid SERIAL primary key, rast raster
);

INSERT INTO gdem_test_500(rast)
SELECT ST_Tile(
  ST_Union(rast),  -- Input raster (notice the Union)
  1,               -- Band to extract
  500,             -- Tile size in pixels (X)
  500,             -- Tile size in pixels (Y)
  FALSE            -- padwithnodata (pretty much always no)
)
FROM gdem_test_100;
-- SELECT FROM the subset above to speed up to process

SELECT AddRasterConstraints(
  'gdem_test_500'::name,  -- table
  'rast'::name  -- raster geometry column
);

CREATE INDEX gdem_test_500_gist_idx
ON gdem_test_500
USING GIST(ST_ConvexHull(rast));





--
---
-----  Create 51x51 test table
---
--
CREATE TABLE public.gdem_test_51 (
  rid SERIAL primary key, rast raster
);

INSERT INTO gdem_test_51(rast)
SELECT ST_Tile(ST_Union(rast), 1, 51, 51, FALSE)
FROM gdem_test_100;

SELECT AddRasterConstraints(
  'gdem_test_51'::name,  -- table
  'rast'::name  -- raster geometry column
);

CREATE INDEX gdem_test_51_gist_idx
ON gdem_test_51
USING GIST(ST_ConvexHull(rast));





--
---
-----  Create 26x26 test table
---
--
CREATE TABLE public.gdem_test_26 (
  rid SERIAL primary key, rast raster
);

INSERT INTO gdem_test_26(rast)
SELECT ST_Tile(ST_Union(rast), 1, 51, 51, FALSE)
FROM gdem_test_100;

SELECT AddRasterConstraints(
  'gdem_test_26'::name,  -- table
  'rast'::name  -- raster geometry column
);

CREATE INDEX gdem_test_26_gist_idx
ON gdem_test_26
USING GIST(ST_ConvexHull(rast));





--
---
-----  Verify that the test tables area all loaded correctly
---
--
SELECT r_table_name, srid, same_alignment,
       regular_blocking, nodata_values, spatial_index
FROM raster_columns
WHERE r_table_name LIKE 'gdem\_test%';





--
---
-----  TEST 500x500
---
--
EXPLAIN ANALYZE
SELECT ST_Union(rast)
FROM gdem_test_500
WHERE ST_Intersects(
  ST_Envelope(rast), ST_Envelope(ST_Buffer(
    ST_SetSRID(ST_MakePoint(-105.085670, 40.572171), 4326)::geography
    , 10000)::geometry)
);



-- Aggregate  (cost=9.03..9.04 rows=1 width=32) (actual time=871.862..871.862 rows=1 loops=1)
--   ->  Seq Scan on gdem_test_500  (cost=0.00..9.03 rows=2 width=32) (actual time=15.861..37.947 rows=6 loops=1)
--         Filter: ((st_envelope(rast) && '0103000020E61000000100000005000000065AB8440B4D5AC0602B15D7B43D4440065AB8440B4D5AC0C83A8CE9C4544440915526F5EB3D5AC0C83A8CE9C4544440915526F5EB3D5AC0602B15D7B43D4440065AB8440B4D5AC0602B15D7B43D4440'::geometry) AND _st_intersects(st_envelope(rast), '0103000020E61000000100000005000000065AB8440B4D5AC0602B15D7B43D4440065AB8440B4D5AC0C83A8CE9C4544440915526F5EB3D5AC0C83A8CE9C4544440915526F5EB3D5AC0602B15D7B43D4440065AB8440B4D5AC0602B15D7B43D4440'::geometry))
--         Rows Removed by Filter: 24
-- Planning time: 1.992 ms
-- Execution time: 871.924 ms


--
---
-----  TEST 100x100
---
--
EXPLAIN ANALYZE
SELECT ST_Union(rast)
FROM gdem_test_100
WHERE ST_Intersects(
  ST_Envelope(rast), ST_Envelope(ST_Buffer(
    ST_SetSRID(ST_MakePoint(-105.085670, 40.572171), 4326)::geography
    , 10000)::geometry)
);


-- Aggregate  (cost=312.54..312.55 rows=1 width=27) (actual time=840.927..840.928 rows=1 loops=1)
--   ->  Seq Scan on gdem_test_100  (cost=0.00..312.35 rows=76 width=27) (actual time=6.319..71.598 rows=154 loops=1)
--         Filter: ((st_envelope(rast) && '0103000020E61000000100000005000000065AB8440B4D5AC0602B15D7B43D4440065AB8440B4D5AC0C83A8CE9C4544440915526F5EB3D5AC0C83A8CE9C4544440915526F5EB3D5AC0602B15D7B43D4440065AB8440B4D5AC0602B15D7B43D4440'::geometry) AND _st_intersects(st_envelope(rast), '0103000020E61000000100000005000000065AB8440B4D5AC0602B15D7B43D4440065AB8440B4D5AC0C83A8CE9C4544440915526F5EB3D5AC0C83A8CE9C4544440915526F5EB3D5AC0602B15D7B43D4440065AB8440B4D5AC0602B15D7B43D4440'::geometry))
--         Rows Removed by Filter: 980
-- Planning time: 1.810 ms
-- Execution time: 841.750 ms


--
---
-----  TEST 51x51
---
--
EXPLAIN ANALYZE
SELECT ST_Union(rast)
FROM gdem_test_51
WHERE ST_Intersects(
  ST_Envelope(rast), ST_Envelope(ST_Buffer(
    ST_SetSRID(ST_MakePoint(-105.085670, 40.572171), 4326)::geography
    , 10000)::geometry)
);


-- Aggregate  (cost=627.35..627.36 rows=1 width=163) (actual time=404.497..404.497 rows=1 loops=1)
--   ->  Seq Scan on gdem_test_51  (cost=0.00..626.99 rows=143 width=163) (actual time=16.506..47.671 rows=234 loops=1)
--         Filter: ((st_envelope(rast) && '0103000020E61000000100000005000000065AB8440B4D5AC0602B15D7B43D4440065AB8440B4D5AC0C83A8CE9C4544440915526F5EB3D5AC0C83A8CE9C4544440915526F5EB3D5AC0602B15D7B43D4440065AB8440B4D5AC0602B15D7B43D4440'::geometry) AND _st_intersects(st_envelope(rast), '0103000020E61000000100000005000000065AB8440B4D5AC0602B15D7B43D4440065AB8440B4D5AC0C83A8CE9C4544440915526F5EB3D5AC0C83A8CE9C4544440915526F5EB3D5AC0602B15D7B43D4440065AB8440B4D5AC0602B15D7B43D4440'::geometry))
--         Rows Removed by Filter: 1908
-- Planning time: 2.096 ms
-- Execution time: 405.214 ms



--
---
-----  TEST 26x26
---
--
EXPLAIN ANALYZE
SELECT ST_Union(rast)
FROM gdem_test_26
WHERE ST_Intersects(
  ST_Envelope(rast), ST_Envelope(ST_Buffer(
    ST_SetSRID(ST_MakePoint(-105.085670, 40.572171), 4326)::geography
    , 10000)::geometry)
);


-- Aggregate  (cost=627.35..627.36 rows=1 width=163) (actual time=406.121..406.121 rows=1 loops=1)
--    ->  Seq Scan on gdem_test_26  (cost=0.00..626.99 rows=143 width=163) (actual time=17.074..48.560 rows=234 loops=1)
--          Filter: ((st_envelope(rast) && '0103000020E61000000100000005000000065AB8440B4D5AC0602B15D7B43D4440065AB8440B4D5AC0C83A8CE9C4544440915526F5EB3D5AC0C83A8CE9C4544440915526F5EB3D5AC0602B15D7B43D4440065AB8440B4D5AC0602B15D7B43D4440'::geometry) AND _st_intersects(st_envelope(rast), '0103000020E61000000100000005000000065AB8440B4D5AC0602B15D7B43D4440065AB8440B4D5AC0C83A8CE9C4544440915526F5EB3D5AC0C83A8CE9C4544440915526F5EB3D5AC0602B15D7B43D4440065AB8440B4D5AC0602B15D7B43D4440'::geometry))
--          Rows Removed by Filter: 1908
--  Planning time: 2.145 ms
--  Execution time: 406.853 ms
