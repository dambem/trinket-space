import React from 'react';
import { defineQuery } from "next-sanity";
import { client } from "app/sanity/client";
import Link from "next/link";

const options = { next: { revalidate: 60 } };

// const events_QUERY = defineQuery(`*[
//   _type == "talk"
// ]{_id, url, title, description, date, type, slug} | order(created desc)`);

// export default async function Projects() {
//   const events = await Promise.all([
//     client.fetch(events_QUERY, {}, options),

//   ]);
//   return (
//       <section className=" w-full px-4 md:px-6 ">

//         <div className="flex main-section-min flex-col md:flex-row w-screen md:w-auto md:mx-[-35%] gap-8">

//         <div className="w-full">
//         <h2 className="mb-8 text-2xl font-medium tracking-tight title-left" >talks i'm doing, events i'm organising, conferences i'm attending </h2>
//         {/* <p> I'm happy to chat about any of these - especially t</p> */}
//         {events.map((event, index) => (
//             <Link
//               key={index}
//               href={event.url}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="group rounded  drop-shadow-md  block bg-transparent	 overflow-hidden shadow-sm hover:shadow-md hover:bg-stone-950 transition-shadow duration-300"
//             > 
//             {event.title}
//             <span 
//             className="text-xs px-2 py-1 rounded-full bg-zinc-800 text-zinc-300 whitespace-nowrap"
//             >
//             {event.date}
//             </span>
//             <span 
//             className="text-xs px-2 py-1 rounded-full bg-zinc-800 text-zinc-300 whitespace-nowrap"
//             >
//             {event.type}
//             </span>
//             </Link>
//         ))}
//         </div>
//         </div>
//       </section>
//     );
// }

export default async function Projects() {
  return (
      <section className=" w-full px-4 md:px-6 ">
        
        <div className="flex main-section-min flex-col md:flex-row w-screen md:w-auto md:mx-[-35%] gap-8">    
        <div className="w-full">
          test
        </div>
        </div>
      </section>
    );
}