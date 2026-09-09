do $$
declare
  festival_record record;
  category_record record;
  category_data jsonb;
  item_data jsonb;
  categories jsonb;
begin
  for festival_record in select id, slug from public.festivals loop
    if festival_record.slug = 'executivo' then
      categories := '[{"name":"Entradas quentes","items":["Croquete de salmão","Tilápia empanada","Harumaki de queijo"]},{"name":"Entradas frias","items":["Ceviche Salmão","Sunomono tradicional"]},{"name":"Temakis","items":["Hot Grill","Salmão Grill"]},{"name":"Hossomaki","items":["Salmão Grill","Sakemaki (salmão)"]},{"name":"Uramakis","items":["Filadélfia","Crispy porco","Crispy de couve","Crispy de cebola"]},{"name":"Hot Roll","items":["Hot Crispy couve","Hot Crispy Batata Doce","Hot Crispy cebola"]},{"name":"Nigiris","items":["Salmão","Salmão flambado"]},{"name":"Sobremesa a vontade","items":["Harumaki doce de leite",{"name":"Sorvete","subitems":["Creme","Morango","Chocolate"]}]},{"name":"Bebida a vontade","items":["Guaraná zero lata","Guaraná lata","Água sem gás"]},{"name":"Sucos","items":["Maracujá","Abacaxi"]}]';
    elsif festival_record.slug = 'salmao' then
      categories := '[{"name":"Entradas quentes","items":["Croquete de salmão","Tilápia empanada","Harumaki de queijo"]},{"name":"Entradas frias","items":["Ceviche Salmão","Sunomono tradicional","4 sashimi de salmão","Usuzukuri de salmão"]},{"name":"Temakis","items":["Hot Grill","Salmão Grill","Filadélfia"]},{"name":"Hossomaki","items":["Salmão Grill","Sakemaki (salmão)"]},{"name":"Uramakis","items":["Filadélfia","Crispy porco","Crispy de couve","Crispy de cebola"]},{"name":"Hot Roll","items":["Hot Crispy couve","Hot Crispy Batata Doce","Hot Crispy cebola"]},{"name":"Nigiris","items":["Salmão","Salmão flambado"]},{"name":"Gunkan","items":["Filadélfia","Crispy de Batata Doce","Crispy de Couve","Crispy de Alho Poró"]},{"name":"Sobremesa a vontade","items":["Harumaki doce de leite","Hot sensação",{"name":"Sorvete","subitems":["Creme","Morango","Chocolate"]}]},{"name":"Sucos","items":["Maracujá","Abacaxi com hortelã","Frutas vermelhas"]},{"name":"Bebidas a vontade","items":["Guaraná lata/zero","Água sem gás"]},{"name":"Drinks a vontade","items":[{"name":"Soda Italiana","subitems":["Maracujá","Morango","Maçã verde","Frutas vermelhas","Pink","Blue"]},"Caipirinha de limão"]}]';
    elsif festival_record.slug = 'prime' then
      categories := '[{"name":"Entradas frias","items":["Ceviche Salmão","Sunomono tradicional","4 sashimi de salmão","4 sashimi trufado","Usuzukuri de salmão","Usuzukuri selado"]},{"name":"Entradas quentes","items":["Croquete de salmão","Tilápia empanada","Harumaki de queijo","Ebbiten do chef","Pipoca de camarão"]},{"name":"Temakis","items":["Hot Grill","Salmão Grill","Filadélfia","salmão e doritos"]},{"name":"Hossomaki","items":["Salmão Grill","Sakemaki (salmão)"]},{"name":"Uramakis","items":["Filadélfia","Crispy porco","Crispy de couve","Crispy de cebola"]},{"name":"Hot Roll","items":["Hot Crispy couve","Hot Crispy Batata Doce","Hot Crispy cebola"]},{"name":"Nigiris","items":["Salmão","Salmão flambado"]},{"name":"Gunkan","items":["Filadélfia","Crispy de Batata Doce","Crispy de Couve","Crispy de Alho poró"]},{"name":"Sobremesa a vontade","items":["Harumaki doce de leite","Hot sensação",{"name":"Sorvete","subitems":["Creme","Morango","Chocolate"]}]},{"name":"Bebidas a vontade","items":["Coca cola lata/zero","Guaraná lata/zero","Fanta uva / laranja lata","Água com gás/sem gás"]},{"name":"Sucos","items":["Maracujá","Abacaxi / com Hortelã","Frutas vermelhas","Laranja"]},{"name":"Drinks a vontade","items":[{"name":"Soda Italiana","subitems":["Maracujá","Morango","Maçã verde","Frutas vermelhas","Pink","Blue"]},"Caipirinha de limão","Sakerinha de frutas"]}]';
    else continue;
    end if;

    for category_data in select value from jsonb_array_elements(categories) loop
      insert into public.festival_categories (festival_id, name, display_order) values (festival_record.id, category_data->>'name', (select count(*) + 1 from public.festival_categories where festival_id = festival_record.id)) on conflict (festival_id, name) do update set display_order = excluded.display_order returning * into category_record;
      for item_data in select value from jsonb_array_elements(category_data->'items') loop
        insert into public.festival_items (category_id, name, subitems, display_order) values (category_record.id, case when jsonb_typeof(item_data) = 'object' then item_data->>'name' else trim(both '"' from item_data::text) end, case when jsonb_typeof(item_data) = 'object' then coalesce(item_data->'subitems', '[]'::jsonb) else '[]'::jsonb end, (select count(*) + 1 from public.festival_items where category_id = category_record.id));
      end loop;
    end loop;
  end loop;
end $$;
