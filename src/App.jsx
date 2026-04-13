import React, { useMemo, useState } from "react";

const QUANTITIES = Array.from({ length: 21 }, (_, i) => String(i));

const initialCatalog = [
  {
    company: "Game",
    groups: [
      {
        type: "Main",
        items: [
          "Natural Silver",
          "Diamond",
          "Red Sweets",
          "Black Sweets",
          "Blue",
          "Green",
          "White Grape",
          "Honey",
          "Espresso Martini",
          "Grape",
          "Mango",
          "Pineapple",
        ],
      },
      {
        type: "Leaf",
        items: ["Natural", "Dark", "White Russian"],
      },
      {
        type: "Game Minis",
        items: ["Diamond", "Black Sweets", "Blue", "Red Sweets"],
      },
    ],
  },
  {
    company: "BLK",
    groups: [
      {
        type: "Main",
        items: ["Smooth", "Cream", "Wine", "Grape", "Cocoa", "Berry"],
      },
    ],
  },
  {
    company: "White Owl",
    groups: [
      {
        type: "Main",
        items: [
          "Silver",
          "Platinum",
          "Sweets",
          "Green Sweets",
          "Emerald",
          "Black Sweets",
          "White Grape",
          "White Peach",
          "White Russian",
          "Swirl Triple Grape",
          "Swirl Chocolate",
          "Pineapple",
          "Mango",
          "Blue Raspberry",
          "Strawberry",
        ],
      },
      {
        type: "White Owl Mini Cigarillos",
        items: ["Sweets", "Silver"],
      },
    ],
  },
  {
    company: "Swisher",
    groups: [
      {
        type: "Main",
        items: ["Original", "Diamonds", "Silver", "Green", "Grape", "Cookies n Cream", "Mango Blaze"],
      },
      {
        type: "Swisher Mini Cigarillos",
        items: ["Original", "Diamond"],
      },
      {
        type: "Swisher Leaf",
        items: ["Original", "Dark Stout", "Dark Leaf", "Aromatic", "Honey", "Irish Cream", "Peach Brandy", "Cognac"],
      },
      {
        type: "Swisher Leaf Wraps",
        items: ["Original", "Irish Cream", "Peach Brandy"],
      },
    ],
  },
  {
    company: "Backwoods",
    groups: [
      {
        type: "Main",
        items: ["Russian Cream", "Sweet Aromatic", "Rum Cake", "Banana"],
      },
    ],
  },
];

function keyFor(company, type, item) {
  return `${company}__${type}__${item}`;
}

function buildInitialState(catalog) {
  const initial = {};
  catalog.forEach((company) => {
    company.groups.forEach((group) => {
      group.items.forEach((item) => {
        initial[keyFor(company.company, group.type, item)] = {
          checked: false,
          quantity: "0",
        };
      });
    });
  });
  return initial;
}

function mergeValues(catalog, prevValues = {}) {
  return { ...buildInitialState(catalog), ...prevValues };
}

export default function App() {
  const [catalog, setCatalog] = useState(initialCatalog);
  const [values, setValues] = useState(() => buildInitialState(initialCatalog));
  const [copied, setCopied] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [newCompany, setNewCompany] = useState("");
  const [newTypeCompany, setNewTypeCompany] = useState("");
  const [newTypeName, setNewTypeName] = useState("");
  const [newItemCompany, setNewItemCompany] = useState("");
  const [newItemType, setNewItemType] = useState("Main");
  const [newItemName, setNewItemName] = useState("");

  const updateChecked = (key, checked) => {
    setValues((prev) => ({
      ...prev,
      [key]: { ...prev[key], checked },
    }));
  };

  const updateQuantity = (key, quantity) => {
    setValues((prev) => ({
      ...prev,
      [key]: { ...prev[key], quantity },
    }));
  };

  const outputText = useMemo(() => {
    const lines = [];

    catalog.forEach((company) => {
      const companyLines = [];

      company.groups.forEach((group) => {
        const selectedItems = group.items
          .map((item) => {
            const key = keyFor(company.company, group.type, item);
            const entry = values[key];
            if (!entry?.checked) return null;
            if (Number(entry.quantity) === 0) return null;
            return `${item} - ${entry.quantity}`;
          })
          .filter(Boolean);

        if (selectedItems.length > 0) {
          if (group.type === "Main") {
            companyLines.push(...selectedItems);
          } else {
            companyLines.push(`${group.type}:`);
            companyLines.push(...selectedItems.map((line) => `  ${line}`));
          }
        }
      });

      if (companyLines.length > 0) {
        lines.push(`${company.company}:`);
        lines.push(...companyLines.map((line) => `  ${line}`));
        lines.push("");
      }
    });

    return lines.join("\n").trim();
  }, [values, catalog]);

  const copyToClipboard = async () => {
    const text = outputText || "No items selected.";
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  const addCompany = () => {
    const name = newCompany.trim();
    if (!name) return;
    if (catalog.some((c) => c.company.toLowerCase() === name.toLowerCase())) return;
    const nextCatalog = [...catalog, { company: name, groups: [{ type: "Main", items: [] }] }];
    setCatalog(nextCatalog);
    setValues((prev) => mergeValues(nextCatalog, prev));
    setNewCompany("");
  };

  const addType = () => {
    const companyName = newTypeCompany.trim();
    const typeName = newTypeName.trim();
    if (!companyName || !typeName) return;
    const nextCatalog = catalog.map((company) => {
      if (company.company !== companyName) return company;
      if (company.groups.some((group) => group.type.toLowerCase() === typeName.toLowerCase())) return company;
      return { ...company, groups: [...company.groups, { type: typeName, items: [] }] };
    });
    setCatalog(nextCatalog);
    setValues((prev) => mergeValues(nextCatalog, prev));
    setNewTypeName("");
  };

  const addItem = () => {
    const companyName = newItemCompany.trim();
    const itemName = newItemName.trim();
    if (!companyName || !itemName) return;

    const nextCatalog = catalog.map((company) => {
      if (company.company !== companyName) return company;
      return {
        ...company,
        groups: company.groups.map((group) => {
          if (group.type !== newItemType) return group;
          if (group.items.some((item) => item.toLowerCase() === itemName.toLowerCase())) return group;
          return { ...group, items: [...group.items, itemName] };
        }),
      };
    });

    setCatalog(nextCatalog);
    setValues((prev) => ({
      ...mergeValues(nextCatalog, prev),
      [keyFor(companyName, newItemType, itemName)]: { checked: false, quantity: "0" },
    }));
    setNewItemName("");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 text-gray-900">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 rounded-3xl bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold">Simple Order Builder</h1>
              <p className="mt-2 text-sm text-gray-600">
                Check items, choose quantity from 0 to 20, then copy the text and paste it into GPT.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowAdd((prev) => !prev)}
              className="rounded-2xl bg-black px-4 py-3 text-sm font-medium text-white"
            >
              {showAdd ? "Close add panel" : "Add company / type / item"}
            </button>
          </div>

          {showAdd && (
            <div className="mt-5 grid gap-4 rounded-2xl border border-gray-200 p-4 md:grid-cols-3">
              <div className="rounded-2xl border border-gray-200 p-3">
                <h2 className="mb-3 text-sm font-semibold">Add company</h2>
                <input
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  placeholder="Company name"
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none"
                />
                <button
                  type="button"
                  onClick={addCompany}
                  className="mt-3 w-full rounded-xl bg-black px-3 py-2 text-sm text-white"
                >
                  Add company
                </button>
              </div>

              <div className="rounded-2xl border border-gray-200 p-3">
                <h2 className="mb-3 text-sm font-semibold">Add type</h2>
                <select
                  value={newTypeCompany}
                  onChange={(e) => setNewTypeCompany(e.target.value)}
                  className="mb-2 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
                >
                  <option value="">Select company</option>
                  {catalog.map((company) => (
                    <option key={company.company} value={company.company}>
                      {company.company}
                    </option>
                  ))}
                </select>
                <input
                  value={newTypeName}
                  onChange={(e) => setNewTypeName(e.target.value)}
                  placeholder="Type name"
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none"
                />
                <button type="button" onClick={addType} className="mt-3 w-full rounded-xl bg-black px-3 py-2 text-sm text-white">
                  Add type
                </button>
              </div>

              <div className="rounded-2xl border border-gray-200 p-3">
                <h2 className="mb-3 text-sm font-semibold">Add item</h2>
                <select
                  value={newItemCompany}
                  onChange={(e) => {
                    const companyName = e.target.value;
                    setNewItemCompany(companyName);
                    const firstType = catalog.find((company) => company.company === companyName)?.groups?.[0]?.type || "Main";
                    setNewItemType(firstType);
                  }}
                  className="mb-2 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
                >
                  <option value="">Select company</option>
                  {catalog.map((company) => (
                    <option key={company.company} value={company.company}>
                      {company.company}
                    </option>
                  ))}
                </select>
                <select
                  value={newItemType}
                  onChange={(e) => setNewItemType(e.target.value)}
                  className="mb-2 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
                >
                  {(catalog.find((company) => company.company === newItemCompany)?.groups || [{ type: "Main" }]).map((group) => (
                    <option key={group.type} value={group.type}>
                      {group.type}
                    </option>
                  ))}
                </select>
                <input
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder="Item name"
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none"
                />
                <button type="button" onClick={addItem} className="mt-3 w-full rounded-xl bg-black px-3 py-2 text-sm text-white">
                  Add item
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            {catalog.map((company) => (
              <div key={company.company} className="rounded-3xl bg-white p-4 shadow-sm">
                <h2 className="mb-4 text-xl font-semibold">{company.company}</h2>

                <div className="space-y-4">
                  {company.groups.map((group) => (
                    <div key={group.type} className="rounded-2xl border border-gray-200 p-3">
                      <h3 className="mb-3 text-sm font-semibold text-gray-700">{group.type}</h3>

                      <div className="space-y-2">
                        {group.items.map((item) => {
                          const key = keyFor(company.company, group.type, item);
                          const entry = values[key];

                          return (
                            <div key={key} className="flex items-center gap-3 rounded-xl border border-gray-200 p-3">
                              <input
                                type="checkbox"
                                checked={entry.checked}
                                onChange={(e) => updateChecked(key, e.target.checked)}
                                className="h-4 w-4"
                              />

                              <div className="min-w-0 flex-1">
                                <div className="text-sm font-medium">{item}</div>
                              </div>

                              <select
                                value={entry.quantity}
                                onChange={(e) => updateQuantity(key, e.target.value)}
                                className="rounded-lg border border-gray-300 px-2 py-2 text-sm"
                              >
                                {QUANTITIES.map((qty) => (
                                  <option key={qty} value={qty}>
                                    {qty}
                                  </option>
                                ))}
                              </select>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4 lg:sticky lg:top-4 lg:self-start">
            <div className="rounded-3xl bg-white p-4 shadow-sm">
              <h2 className="text-xl font-semibold">Copied text preview</h2>
              <textarea
                readOnly
                value={outputText}
                className="mt-4 min-h-[500px] w-full rounded-2xl border border-gray-300 p-3 font-mono text-sm outline-none"
                placeholder="Selected items will appear here"
              />

              <button
                type="button"
                onClick={copyToClipboard}
                className="mt-4 w-full rounded-2xl bg-black px-4 py-3 text-sm font-medium text-white"
              >
                {copied ? "Copied" : "Copy to clipboard"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

