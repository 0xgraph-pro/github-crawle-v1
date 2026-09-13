// const users = [
//   {
//     username: "vitalik",
//     name: "Vitalik Buterin",
//     avatar: "https://github.com/vitalik.png",
//     followers: 5120,
//     following: 87,
//     repos: 124,
//     status: "Active",
//   },
//   {
//     username: "gakonst",
//     name: "Georgios Konstantopoulos",
//     avatar: "https://github.com/gakonst.png",
//     followers: 3210,
//     following: 142,
//     repos: 98,
//     status: "Active",
//   },
//   {
//     username: "hayden",
//     name: "Hayden Adams",
//     avatar: "https://github.com/hayden.png",
//     followers: 8920,
//     following: 210,
//     repos: 76,
//     status: "Inactive",
//   },
// ]

// function UserTable({ users }) {
//   return (
//     <div className="table-container">
//       <table className="users-table">
//         <thead>
//           <tr className="">
//             <th style={{ width: "10%", overflow: "hidden" }}>
//               Developer
//             </th>
//             <th style={{ width: "30%", overflow: "hidden" }}>
//               Bio
//             </th>
//             <th style={{ width: "10%", overflow: "hidden" }}>
//               Followers
//             </th>
//             <th style={{ width: "10%", overflow: "hidden" }}>
//               Following
//             </th>
//             <th style={{ width: "10%", overflow: "hidden" }}>
//               Repositories
//             </th>
//             <th style={{ width: "30%", overflow: "hidden" }}>
//               Socials
//             </th>
//           </tr>
//         </thead>

//         <tbody className="divide-y divide-zinc-800/70">
//           {users.length >0 ? users.map((user) => (
//             <tr
//               key={user.login}
//               className="group transition-colors duration-200 hover:bg-zinc-900/60"
//             >
//               {/* Avatar + Name */}
//               <td className="py-5">
//                 <div className="flex items-center gap-4">
//                   <div className="relative">
//                     <img
//                       src={user.avatar_url}
//                       alt={user.name}
//                       className="avatar"
//                     />

//                     {/* Online indicator */}
//                     {user.status === "Active" && (
//                       <span className="
//                         absolute
//                         bottom-0
//                         right-0
//                         h-3
//                         w-3
//                         rounded-full
//                         border-2
//                         border-zinc-950
//                         bg-emerald-500
//                       " />
//                     )}
//                   </div>

//                   <div>
//                     <div className="font-semibold text-zinc-100">
//                       {user.name}
//                     </div>

//                     <a className="mt-0.5 text-sm text-zinc-500" href={`https://github.com/${user.login}`} target={"_blank"}>
//                       @{user.login}
//                     </a>
//                   </div>
//                 </div>
//               </td>
              
//               {/* Bio */}
//               <td className="py-5">
//                 <span className="text-sm text-zinc-300">
//                   {user.bio ? user.bio : `<No Bio>`}
//                 </span>
//               </td>

//               {/* Followers */}
//               <td className="py-5">
//                 <span className="text-sm font-medium text-zinc-200">
//                   {user.followers.toLocaleString()}
//                 </span>
//               </td>

//               {/* Following */}
//               <td className="py-5">
//                 <span className="text-sm text-zinc-300">
//                   {user.following.toLocaleString()}
//                 </span>
//               </td>

//               {/* Repositories */}
//               <td className="py-5">
//                 <span className="text-sm text-zinc-300">
//                   {user.public_repos}
//                 </span>
//               </td>

//               {/* Socials */}
//               <td className="status">
//                 <span
//                   className={`
//                     inline-flex items-center gap-2
//                     rounded-full
//                     px-3 py-1
//                     text-xs font-medium
//                     ${
//                       user.status === "Active"
//                         ? "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20"
//                         : "bg-zinc-800 text-zinc-500 ring-1 ring-zinc-700"
//                     }
//                   `}
//                 >
//                   {/* {user.status} */}
//                 </span>
//               </td>
//             </tr>
//           )) : <tr><td colSpan={6}>There is no data.</td></tr>}
//         </tbody>
//       </table>
//     </div>
//   )
// }
import {Pagination, Table} from "@heroui/react";
import {useMemo, useState} from "react";
import { Avatar, EmptyState } from '@heroui/react';
import { Icon } from "@iconify/react";

const columns = [
  {id: "ID", name: "#ID"},
  {id: "bio", name: "Bio"},
  {id: "location", name: "Location"},
  {id: "followers", name: "Followers"},
  {id: "following", name: "Following"},
  {id: "public_repos", name: "Repos"},
  {id: "social_data", name: "Contacts"},
];
// const users = [
//   {email: "kate@acme.com", id: 1, name: "Kate Moore", role: "CEO", status: "Active"},
//   {email: "john@acme.com", id: 2, name: "John Smith", role: "CTO", status: "Active"},
//   {email: "sara@acme.com", id: 3, name: "Sara Johnson", role: "CMO", status: "On Leave"},
//   {email: "michael@acme.com", id: 4, name: "Michael Brown", role: "CFO", status: "Active"},
//   {
//     email: "emily@acme.com",
//     id: 5,
//     name: "Emily Davis",
//     role: "Product Manager",
//     status: "Inactive",
//   },
//   {email: "davis@acme.com", id: 6, name: "Davis Wilson", role: "Lead Designer", status: "Active"},
//   {
//     email: "olivia@acme.com",
//     id: 7,
//     name: "Olivia Martinez",
//     role: "Frontend Engineer",
//     status: "Active",
//   },
//   {
//     email: "james@acme.com",
//     id: 8,
//     name: "James Taylor",
//     role: "Backend Engineer",
//     status: "Active",
//   },
// ];

const ROWS_PER_PAGE = 10;

export function UserTable({ users }) {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(users.length / ROWS_PER_PAGE);
  const pages = Array.from({length: totalPages}, (_, i) => i + 1);
  const paginatedItems = useMemo(() => {
    const start = (page - 1) * ROWS_PER_PAGE;
    return users.slice(start, start + ROWS_PER_PAGE);
  }, [page, users.length]);
  const start = (page - 1) * ROWS_PER_PAGE + 1;
  const end = Math.min(page * ROWS_PER_PAGE, users.length);

  return (
    <Table >
      <Table.ScrollContainer>
        <Table.Content aria-label="Table with pagination" className="min-w-150">
          <Table.Header columns={columns}>
            {(column) => (
              <Table.Column isRowHeader={column.id === "name"}>{column.name}</Table.Column>
            )}
          </Table.Header>
          <Table.Body items={paginatedItems} renderEmptyState={() => (
              <EmptyState className="flex h-full w-full flex-col items-center justify-center gap-4 text-center">
                <Icon className="size-6 text-muted" icon="gravity-ui:tray" />
                <span className="text-sm text-muted">No results found</span>
              </EmptyState>)}>
            {(user) => (
              <Table.Row>
                <Table.Cell>
                  <a href={`https://github.com/${user.login}`} target={"_blank"} className="flex items-center gap-3">
                    <Avatar size="sm">
                        <Avatar.Image src={user.avatar_url} />
                        <Avatar.Fallback>
                          
                        </Avatar.Fallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-xs">{user.name}</span>
                        <span className="text-xs text-muted">
                          <a >{user.login}</a>
                        </span>
                      </div>
                    </a>
                </Table.Cell>
                <Table.Cell>
                  {user.bio}
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap">
                  {user.location}
                </Table.Cell>
                <Table.Cell>
                  {user.followers}
                </Table.Cell>
                <Table.Cell>
                  {user.following}
                </Table.Cell>
                <Table.Cell>
                  {user.public_repos}
                </Table.Cell>
                <Table.Cell>
                  <div className="flex gap-2">
                    {user.email == "null" ? <a href={`mailto:${user.email}`}><img src="/icons/icon-email.png" width={24} height={24} /></a> : ""}
                    {user.social_data.map(social => {
                      switch(social.provider) {
                        case "linkedin":
                          return <a href={social.url}><img src="/icons/icon-linkedin.png" width={24} height={24} /></a>
                        case "twitter":
                          return <a href={social.url}><img src="/icons/icon-twitter.png" width={24} height={24} /></a>
                      }
                    })}
                  </div>
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
      <Table.Footer>
        <Pagination size="sm">
          <Pagination.Summary>
            {start} to {end} of {users.length} results
          </Pagination.Summary>
          <Pagination.Content>
            <Pagination.Item>
              <Pagination.Previous
                isDisabled={page === 1}
                onPress={() => setPage((p) => Math.max(1, p - 1))}
              >
                <Pagination.PreviousIcon />
                Prev
              </Pagination.Previous>
            </Pagination.Item>
            {pages.map((p) => (
              <Pagination.Item key={p}>
                <Pagination.Link isActive={p === page} onPress={() => setPage(p)}>
                  {p}
                </Pagination.Link>
              </Pagination.Item>
            ))}
            <Pagination.Item>
              <Pagination.Next
                isDisabled={page === totalPages}
                onPress={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Next
                <Pagination.NextIcon />
              </Pagination.Next>
            </Pagination.Item>
          </Pagination.Content>
        </Pagination>
      </Table.Footer>
    </Table>
  );
}

export default UserTable;
