import { ReactElement } from 'react';

import { Check, X } from 'lucide-react';

import { AuthenticatedUser } from '@/types/user-interface';

import { toLocalStringShortDate } from '@/utils/toPersianDate';

import { userListTableHeads } from '@/constant/tableHeads';

type UsersTableProps = {
  users: AuthenticatedUser[];
};

const UsersTable = ({ users }: UsersTableProps): ReactElement => {
  return (
    <div className="border-border bg-surface w-full overflow-x-auto rounded-2xl border shadow-sm">
      <table className="w-full min-w-225 border-separate border-spacing-0 text-sm">
        {/* Header */}
        <thead>
          <tr className="bg-muted/50">
            {userListTableHeads.map((item) => (
              <th
                key={item.id}
                className="border-border text-muted-foreground h-14 border-b px-5 text-center text-xs font-semibold whitespace-nowrap"
              >
                {item.label}
              </th>
            ))}
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {users.map((user, index) => (
            <tr
              key={user._id}
              className="group hover:bg-muted/30 transition-colors duration-200"
            >
              {/* Index */}
              <td className="border-border text-muted-foreground border-b px-5 py-4 text-center text-xs font-medium">
                {index + 1}
              </td>

              {/* Name */}
              <td className="border-border text-primary border-b px-5 py-4 text-center font-semibold whitespace-nowrap">
                {user.name || '—'}
              </td>

              {/* Email */}
              <td className="border-border text-muted-foreground max-w-70 border-b px-5 py-4 text-center">
                <span className="block truncate">{user.email || '—'}</span>
              </td>

              {/* Phone */}
              <td className="border-border border-b px-5 py-4 text-center">
                <div className="text-primary flex items-center justify-center gap-1.5 font-medium whitespace-nowrap">
                  {user.isVerifiedPhoneNumber ? (
                    <Check className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <X className="h-4 w-4 text-rose-400" />
                  )}

                  <span>{user.phoneNumber || '—'}</span>
                </div>
              </td>

              {/* Products */}
              <td className="border-border border-b px-5 py-4 text-center">
                {user.Products?.length ? (
                  <div className="flex flex-wrap justify-center gap-1.5">
                    {user.Products.map((product, index) => (
                      <span
                        key={`${product._id ?? product.title}-${index}`}
                        className="border-border bg-muted/50 text-primary rounded-lg border px-2.5 py-1 text-xs font-medium"
                      >
                        {product.title}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-muted-foreground text-xs">
                    محصولی ندارد
                  </span>
                )}
              </td>

              {/* Created At */}
              <td className="border-border text-muted-foreground border-b px-5 py-4 text-center text-xs font-medium whitespace-nowrap">
                {toLocalStringShortDate(user.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;
