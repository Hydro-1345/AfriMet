-- Sprint 5: African food database seed data

INSERT INTO public.food_categories (slug, name, description) VALUES
  ('grains-starches', 'Grains & Starches', 'Rice, yam, cassava, and other staple carbohydrates.'),
  ('soups-stews', 'Soups & Stews', 'Traditional soups, stews, and sauced dishes.'),
  ('proteins', 'Proteins & Meats', 'Meat, fish, and protein-rich dishes.'),
  ('vegetables', 'Vegetables & Sides', 'Leafy greens, vegetable sides, and accompaniments.'),
  ('snacks-street-food', 'Snacks & Street Food', 'Street food, finger foods, and light bites.');

-- Helper: insert food and aliases via CTEs would be verbose; use explicit inserts.

WITH category_ids AS (
  SELECT slug, id FROM public.food_categories
),
inserted_foods AS (
  INSERT INTO public.foods (
    category_id, name, slug, description, region, serving_description, serving_grams, is_diaspora
  )
  SELECT c.id, v.name, v.slug, v.description, v.region::public.food_region_type,
         v.serving_description, v.serving_grams, v.is_diaspora
  FROM category_ids c
  INNER JOIN (VALUES
    ('grains-starches', 'Jollof Rice', 'jollof-rice', 'Tomato-based one-pot rice popular across West Africa.', 'west_africa', '1 serving plate', 250, false),
    ('grains-starches', 'Fried Rice', 'fried-rice', 'Seasoned rice stir-fried with vegetables and protein.', 'west_africa', '1 serving plate', 250, false),
    ('grains-starches', 'White Rice', 'white-rice', 'Steamed white rice, often served with stew or soup.', 'west_africa', '1 cup cooked', 180, false),
    ('grains-starches', 'Amala', 'amala', 'Smooth swallow made from yam flour, served with soup.', 'west_africa', '1 wrap', 200, false),
    ('grains-starches', 'Eba', 'eba', 'Cassava-based swallow also known as garri fufu.', 'west_africa', '1 wrap', 200, false),
    ('grains-starches', 'Garri', 'garri', 'Fermented cassava granules eaten dry or as eba.', 'west_africa', '1 cup soaked', 150, false),
    ('grains-starches', 'Pounded Yam', 'pounded-yam', 'Pounded yam swallow served with rich soups.', 'west_africa', '1 wrap', 220, false),
    ('grains-starches', 'Banku', 'banku', 'Fermented corn and cassava dough from Ghana.', 'west_africa', '1 ball', 200, false),
    ('grains-starches', 'Waakye', 'waakye', 'Ghanaian rice and beans cooked with millet leaves.', 'west_africa', '1 serving plate', 280, false),
    ('grains-starches', 'Fufu', 'fufu', 'Pounded cassava and plantain swallow common in Ghana.', 'west_africa', '1 ball', 220, false),
    ('grains-starches', 'Ugali', 'ugali', 'Maize meal staple served across East Africa.', 'east_africa', '1 portion', 200, false),
    ('grains-starches', 'Chapati', 'chapati', 'Unleavened flatbread popular in East Africa.', 'east_africa', '1 piece', 60, false),
    ('grains-starches', 'Pap', 'pap', 'Maize porridge staple in Southern Africa.', 'southern_africa', '1 bowl', 250, false),
    ('grains-starches', 'Couscous', 'couscous', 'Steamed semolina grains common in North Africa.', 'north_africa', '1 cup cooked', 180, false),
    ('grains-starches', 'Jollof Rice (Diaspora)', 'jollof-rice-diaspora', 'Party-style jollof rice popular in UK and US diaspora communities.', 'diaspora', '1 serving plate', 260, true),

    ('soups-stews', 'Egusi Soup', 'egusi-soup', 'Melon seed soup with leafy greens and protein.', 'west_africa', '1 bowl', 300, false),
    ('soups-stews', 'Ewedu', 'ewedu', 'Nigerian jute leaf soup often paired with amala.', 'west_africa', '1 bowl', 250, false),
    ('soups-stews', 'Ogbono Soup', 'ogbono-soup', 'Draw soup made from wild mango seeds.', 'west_africa', '1 bowl', 300, false),
    ('soups-stews', 'Nigerian Stewed Beans', 'nigerian-stewed-beans', 'Beans slow-cooked in a pepper and palm oil stew.', 'west_africa', '1 bowl', 280, false),
    ('soups-stews', 'Sukuma Wiki', 'sukuma-wiki', 'Kenyan collard greens sautéed with onions and tomatoes.', 'east_africa', '1 serving', 150, false),
    ('soups-stews', 'Chakalaka', 'chakalaka', 'Spicy vegetable relish from Southern Africa.', 'southern_africa', '1 serving', 120, false),
    ('soups-stews', 'Ful Medames', 'ful-medames', 'Slow-cooked fava beans dish from North Africa.', 'north_africa', '1 bowl', 250, false),

    ('proteins', 'Suya', 'suya', 'Spiced grilled meat skewers from Northern Nigeria.', 'west_africa', '1 skewer portion', 120, false),
    ('proteins', 'Goat Meat Stew', 'goat-meat-stew', 'Slow-cooked goat meat in pepper and tomato sauce.', 'west_africa', '1 serving', 180, false),
    ('proteins', 'Fried Fish', 'fried-fish', 'Whole or filleted fish fried and served with sides.', 'west_africa', '1 medium piece', 150, false),
    ('proteins', 'Nyama Choma', 'nyama-choma', 'East African grilled meat, often goat or beef.', 'east_africa', '1 serving', 200, false),

    ('vegetables', 'Fried Plantain', 'fried-plantain', 'Ripe plantain sliced and fried until caramelised.', 'west_africa', '5 slices', 120, false),
    ('vegetables', 'Plantain (Boiled)', 'boiled-plantain', 'Boiled unripe or semi-ripe plantain as a side.', 'west_africa', '1 medium plantain', 150, false),

    ('snacks-street-food', 'Moi Moi', 'moi-moi', 'Steamed bean pudding made from blended black-eyed peas.', 'west_africa', '1 wrap', 150, false),
    ('snacks-street-food', 'Akara', 'akara', 'Deep-fried bean fritters, a popular street snack.', 'west_africa', '3 pieces', 100, false),
    ('snacks-street-food', 'Puff Puff', 'puff-puff', 'Sweet fried dough balls common at gatherings.', 'west_africa', '4 pieces', 80, false),
    ('snacks-street-food', 'Plantain Chips', 'plantain-chips', 'Crispy fried plantain slices popular in diaspora shops.', 'diaspora', '1 small bag', 50, true),
    ('snacks-street-food', 'Meat Pie', 'meat-pie', 'Baked pastry with seasoned mince, common in diaspora bakeries.', 'diaspora', '1 pie', 120, true)
  ) AS v(category_slug, name, slug, description, region, serving_description, serving_grams, is_diaspora)
    ON v.category_slug = c.slug
  RETURNING id, slug
)
SELECT 1;

INSERT INTO public.food_aliases (food_id, alias, alias_normalized)
SELECT f.id, a.alias, lower(btrim(a.alias))
FROM public.foods f
INNER JOIN (VALUES
  ('jollof-rice', 'Party rice'),
  ('jollof-rice', 'Jollof'),
  ('fried-rice', 'Nigerian fried rice'),
  ('amala', 'Yam flour swallow'),
  ('eba', 'Garri fufu'),
  ('garri', 'Cassava flakes'),
  ('garri', 'Gari'),
  ('pounded-yam', 'Iyan'),
  ('pounded-yam', 'Yam fufu'),
  ('banku', 'Ghana banku'),
  ('waakye', 'Ghana rice and beans'),
  ('fufu', 'Ghana fufu'),
  ('fufu', 'Cassava fufu'),
  ('ugali', 'Posho'),
  ('ugali', 'Nshima'),
  ('chapati', 'East African chapati'),
  ('pap', 'Mielie pap'),
  ('pap', 'Maize porridge'),
  ('couscous', 'North African couscous'),
  ('jollof-rice-diaspora', 'Diaspora jollof'),
  ('egusi-soup', 'Egusi'),
  ('egusi-soup', 'Melon seed soup'),
  ('ewedu', 'Jute leaf soup'),
  ('ewedu', 'Abula'),
  ('ogbono-soup', 'Ogbono'),
  ('ogbono-soup', 'Draw soup'),
  ('nigerian-stewed-beans', 'Ewa agoyin'),
  ('nigerian-stewed-beans', 'Beans porridge'),
  ('sukuma-wiki', 'Collard greens'),
  ('sukuma-wiki', 'Kale side'),
  ('chakalaka', 'South African chakalaka'),
  ('ful-medames', 'Ful'),
  ('ful-medames', 'Fava beans'),
  ('suya', 'Suya meat'),
  ('suya', 'Kilishi'),
  ('goat-meat-stew', 'Asun'),
  ('goat-meat-stew', 'Goat pepper soup'),
  ('fried-fish', 'Panla'),
  ('fried-fish', 'Tilapia fry'),
  ('nyama-choma', 'Grilled goat'),
  ('nyama-choma', 'Kenyan barbecue'),
  ('fried-plantain', 'Dodo'),
  ('fried-plantain', 'Sweet plantain'),
  ('boiled-plantain', 'Unripe plantain'),
  ('moi-moi', 'Moin moin'),
  ('moi-moi', 'Bean pudding'),
  ('akara', 'Bean cake'),
  ('akara', 'Accra'),
  ('puff-puff', 'Puff puff'),
  ('plantain-chips', 'Diaspora plantain chips'),
  ('meat-pie', 'Nigerian meat pie')
) AS a(food_slug, alias)
  ON f.slug = a.food_slug;
