import { createClient } from '@supabase/supabase-js';

// Get Supabase credentials from command line arguments
const supabaseUrl = process.argv[2];
const supabaseKey = process.argv[3];

if (!supabaseUrl || !supabaseKey) {
  console.error('Usage: npx tsx viewstockholm-scraper.ts <supabase-url> <supabase-key>');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

interface Place {
  name: string;
  description: string;
  category: 'cultural' | 'activity' | 'restaurant' | 'cafe' | 'bar' | 'shopping';
  neighborhood: string;
  formatted_address?: string;
  website?: string;
  types?: string[];
}

// Hardcoded data from View Stockholm
const places: Place[] = [
  {
    name: "Stortorget",
    description: "På Stortorget kan du njuta av den fantastiska arkitekturen hos de ikoniska färgglada gamla byggnaderna medan dina smaklökar blir tillfredsställda på någon av de många caféerna och restaurangerna.",
    neighborhood: "Gamla stan",
    category: "cultural",
    types: ["landmark", "history", "architecture"],
    formatted_address: "Stortorget, Gamla stan, Stockholm"
  },
  {
    name: "Nobelmuseet",
    description: "Den största byggnaden på Stortorget är det tidigare börshuset, som numera huserar Nobelmuseet och Nobelbiblioteket. I huset finns även Svenska Akademin med sina 18 ledamöter.",
    neighborhood: "Gamla stan",
    category: "cultural",
    types: ["museum", "history", "education"],
    formatted_address: "Stortorget, Gamla stan, Stockholm"
  },
  {
    name: "Storkyrkan",
    description: "Den närbelägna ståtliga Storkyrkan, som ursprungligen byggdes 1306, har genomgått flera utbyggnader och omvandlingar som resulterat i en exteriör i barockstil och invändigt en femskeppig hallkyrka med gotisk interiör.",
    neighborhood: "Gamla stan",
    category: "cultural",
    types: ["church", "history", "architecture"],
    formatted_address: "Trångsund 1, Gamla stan",
    website: "svenskakyrkan.se"
  },
  {
    name: "Kungliga slottet",
    description: "Officiellt är Kungliga slottet det officiella residenset för Kungafamiljen, men är numera arbetsplats för Kungaparet och de Kungliga hovstaterna. Flera museum finns i byggnaden, bland annat Skattkammaren där Riksregalierna visas.",
    neighborhood: "Gamla stan",
    category: "cultural",
    types: ["palace", "museum", "history"],
    formatted_address: "Gamla stan, Stockholm"
  },
  {
    name: "Fotografiska",
    description: "Ett modernt museum för samtida fotografi med spännande utställningar.",
    neighborhood: "Södermalm",
    category: "cultural",
    types: ["museum", "art", "photography"],
    formatted_address: "Stadsgårdshamnen 22, Södermalm"
  },
  {
    name: "Moderna Museet",
    description: "Fördjupa dig i modern konst, arkitektur och design på Skeppsholmen.",
    neighborhood: "Skeppsholmen",
    category: "cultural",
    types: ["museum", "art", "modern-art"],
    formatted_address: "Exercisplan 4, Skeppsholmen"
  },
  {
    name: "Skansen",
    description: "Levande skandinavisk historia med historiska byggnader, djurpark och kulturupplevelser.",
    neighborhood: "Djurgården",
    category: "activity",
    types: ["museum", "zoo", "history"],
    formatted_address: "Djurgårdsslätten 49-51, Djurgården",
    website: "skansen.se"
  },
  {
    name: "ABBA The Museum",
    description: "Interaktivt museum dedikerat till Sveriges mest kända musikexport.",
    neighborhood: "Djurgården",
    category: "cultural",
    types: ["museum", "music", "entertainment"],
    formatted_address: "Djurgårdsvägen 68, Djurgården"
  },
  {
    name: "Vasamuseet",
    description: "En maritim tidsmaskin där du kan uppleva det välbevarade 1600-talsskeppet Vasa.",
    neighborhood: "Djurgården",
    category: "cultural",
    types: ["museum", "history", "maritime"],
    formatted_address: "Galärvarvsvägen 14, Djurgården"
  },
  {
    name: "Rosendals Trädgård",
    description: "Ekologisk trädgård med café som serverar lunch från jord till bord.",
    neighborhood: "Djurgården",
    category: "cafe",
    types: ["cafe", "garden", "organic"],
    formatted_address: "Rosendalsvägen 38, Djurgården"
  },
  {
    name: "Gröna Lund",
    description: "Stockholms klassiska nöjespark med berg- och dalbanor och andra attraktioner.",
    neighborhood: "Djurgården",
    category: "activity",
    types: ["amusement-park", "entertainment"],
    formatted_address: "Lilla Allmänna Gränd 9, Djurgården"
  }
];

async function insertPlaces() {
  console.log('Inserting places into Supabase...');

  for (const place of places) {
    const { error } = await supabase
      .from('places')
      .insert([place])
      .select();

    if (error) {
      console.error(`Error inserting ${place.name}:`, error);
    } else {
      console.log(`Successfully inserted ${place.name}`);
    }
  }

  console.log(`Processed ${places.length} places`);
}

// Run the insertion
insertPlaces().catch(console.error); 