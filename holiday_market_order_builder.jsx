import React, { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "simple-order-builder-v2";
const QUANTITIES = Array.from({ length: 21 }, (_, i) => String(i));

const initialCatalog = [
  {
    company: "Black and mild (5 pack)",
    groups: [
      {
        type: "Main",
        items: [
          "Jazz wood tip",
          "Jazz plastic tip",
          "Sweet filter tip",
          "Original plastic tip",
          "Original filter tip",
        ],
      },
    ],
  },
  {
    company: "Black and mild (25 pack)",
    groups: [
      {
        type: "Main",
        items: ["Sweet wood tip", "Jazz plastic tip", "Casino plastic tip", "Sweet plastic tip"],
      },
    ],
  },
  {
    company: "Zig Zag Wraps (4 pack)",
    groups: [{ type: "Main", items: ["Straight Up", "Sweet", "Green", "Blueberry", "Grape"] }],
  },
  {
    company: "Hi-Fi",
    groups: [{ type: "Main", items: ["Sweet", "Diamond"] }],
  },
  {
    company: "Bluntville",
    groups: [{ type: "Main", items: ["Triple Vanilla", "Palma Trio", "Pink Diva"] }],
  },
  {
    company: "True Wraps",
    groups: [{ type: "Main", items: ["Original", "Aromatic"] }],
  },
  {
    company: "Backwoods (5 pack)",
    groups: [{ type: "Main", items: ["Rum Cake", "Sweet Aromatic", "Russian Cream", "Banana", "Vanilla"] }],
  },
  {
    company: "Dutch Masters",
    groups: [{ type: "Main", items: ["Honey", "Berry Fusion", "Silver"] }],
  },
  {
    company: "Swisher Sweets",
    groups: [{ type: "Main", items: ["Original", "Grape", "Silver", "Diamond", "Green", "Cookies n Cream", "Mango", "Gold"] }],
  },
  {
    company: "Swisher Minis",
    groups: [{ type: "Main", items: ["Original", "Diamonds"] }],
  },
  {
    company: "Swisher Leafs",
    groups: [{ type: "Main", items: ["Original", "Honey", "Irish Cream", "Peach Brandy"] }],
  },
  {
    company: "Swisher Leaf Wraps",
    groups: [{ type: "Main", items: ["Original", "Irish Cream", "Peach Brandy"] }],
  },
  {
    company: "White Owl",
    groups: [{ type: "Main", items: ["Platinum", "Silver", "Red Sweets", "Green Sweets", "Black Sweets"] }],
  },
  {
    company: "White Owl Minis",
    groups: [{ type: "Main", items: ["Red Sweets", "Silver"] }],
  },
  {
    company: "Game",
    groups: [{ type: "Main", items: ["Natural Silver", "Diamond", "Red Sweets", "Black Sweets", "Grape", "Green", "Blue"] }],
  },
  {
    company: "Game minis",
    groups: [{ type: "Main", items: ["Diamond", "Black Sweets", "Blue", "Red Sweets"] }],
  },
  {
    company: "Game Leaf",
    groups: [{ type: "Main", items: ["White Russian", "Dark", "Natural"] }],
  },
  {
    company: "SHOW",
    groups: [{ type: "Main", items: ["White Grape", "Green", "Silver"] }],
  },
  {
    company: "BLK",
    groups: [{ type: "Main", items: ["Smooth", "Cream", "Cocoa", "Wine", "Berry", "Grape"] }],
  },
  {
    company: "Red Supreme",
    groups: [{ type: "Main", items: ["Red Supreme"] }],
  },
  {
    company: "Taylors Pride",
    groups: [{ type: "Main", items: ["Taylors Pride"] }],
  },
  {
    company: "Big Duke",
    groups: [{ type: "Main", items: ["Big Duke"] }],
  },
  {
    company: "OGK wraps",
    groups: [{ type: "Main", items: ["OGK wraps"] }],
  },
  {
    company: "Top papers",
    groups: [{ type: "Main", items: ["Top papers"] }],
  },
  {
    company: "Raw papers",
    groups: [{ type: "Main", items: ["Long", "Short", "Black"] }],
  },
  {
    company: "Raw Cones",
    groups: [{ type: "Main", items: ["6 pack", "3 pack"] }],
  },
  {
    company: "JOB papers",
    groups: [{ type: "Main", items: ["1.0", "1.5", "1.25"] }],
  },
  {
    company: "Looseleaf wraps(2 pack)",
    groups: [{ type: "Main", items: ["Cookies n Cream"] }],
  },
  {
    company: "Slapwoods wraps(single pack)",
    groups: [{ type: "Main", items: ["Cotton Candy", "Natural", "Sweet Aromatic"] }],
  },
  {
    company: "Grabba Leaf",
    groups: [{ type: "Main", items: ["Single", "Whole Leaf"] }],
  },
  {
    company: "Seneca",
    groups: [{ type: "Main", items: ["Menthol 100s", "Menthol King", "Red 100s", "Red King", "Blue 100s"] }],
  },
  {
    company: "24/7",
    groups: [{ type: "Main", items: ["Menthol 100s", "Menthol King", "Red 100s", "Red King"] }],
  },
  {
    company: "Wildhorse",
    groups: [{ type: "Main", items: ["Menthol 100s", "Red 100s"] }],
  },
];

const DEFAULT_QUANTITIES = {
  [keyFor("Hi-Fi", "Main", "Sweet")]: "2",
};

function keyFor(company, type, item) {
  return `${company}__${type}__${item}`;
}

function buildInitialValues(catalog) {
  const initial = {};
  catalog.forEach((company) => {
    company.groups.forEach((group) => {
      group.items.forEach((item) => {
        const key = keyFor(company.company, group.type, item);
        initial[key] = { quantity: DEFAULT_QUANTITIES[key] ?? "0" };
      });
    });
  });
  return initial;
}

function mergeValues(catalog, savedValues) {
  const base = buildInitialValues(catalog);
  if (!savedValues) return base;
  const merged = { ...base };
  Object.keys(base).forEach((key) => {
    if (savedValues[key]) merged[key] = savedValues[key];
  });
  return merged;
}

function readSavedState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    return null;
  }
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    // ignore storage errors
  }
}

function formatDate(dateValue) {
  const d = new Date(dateValue);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getMonth() + 1}/${d.getDate()}/${String(d.getFullYear()).slice(-2)}`;
}

function buildOrderLines(catalog, values) {
  const lines = [];

  catalog.forEach((company) => {
    const companyLines = [];

    company.groups.forEach((group) => {
      const selectedItems = group.items
        .map((item) => {
          const key = keyFor(company.company, group.type, item);
          const entry = values[key];
          if (!entry) return null;
          if (Number(entry.quantity) <= 0) return null;
          return `${item} - ${entry.quantity}`;
        })
        .filter(Boolean);

      if (selectedItems.length > 0) {
        if (group.type === "Main") {
          companyLines.push.apply(companyLines, selectedItems);
        } else {
          companyLines.push(`${group.type}:`);
          selectedItems.forEach((line) => companyLines.push(`  ${line}`));
        }
      }
    });

    if (companyLines.length > 0) {
      lines.push(`${company.company}:`);
      companyLines.forEach((line) => lines.push(`  ${line}`));
      lines.push("");
    }
  });

  return lines.join("\n").trim();
}

function buildChatGptPrompt(storeName, storeAddress, orderDate, catalog, values) {
  const orderLines = buildOrderLines(catalog, values);
  const displayDate = formatDate(orderDate);

  return [
    "Create a clean handwritten-style order image on a white background with black handwriting and hand-drawn boxed sections.",
    "Make it look like a neat handwritten store order sheet, not a formal invoice or spreadsheet.",
    "Use compact spacing so the page saves space and remains easy to read.",
    `Store name: ${storeName}`,
    `Store address: ${storeAddress}`,
    `Date: ${displayDate}`,
    "Place the store name centered at the top, the address under it, and the date at the top right.",
    "Include only the items listed below. Group them by company and type exactly as written.",
    "Show each item like Item Name - Quantity.",
    "Use black text only, white paper background, and clean handwritten visual style.",
    "Order details:",
    orderLines || "No items selected.",
  ].join("\n\n");
}

export default function App() {
  const saved = typeof window !== "undefined" ? readSavedState() : null;

  const [storeName, setStoreName] = useState(saved && saved.storeName ? saved.storeName : "Holiday Market");
  const [storeAddress, setStoreAddress] = useState(saved && saved.storeAddress ? saved.storeAddress : "4127 Windsor Spring Rd");
  const [orderDate, setOrderDate] = useState(saved && saved.orderDate ? saved.orderDate : new Date().toISOString().slice(0, 10));
  const [catalog, setCatalog] = useState(saved && saved.catalog ? saved.catalog : initialCatalog);
  const [values, setValues] = useState(() => mergeValues(saved && saved.catalog ? saved.catalog : initialCatalog, saved ? saved.values : null));
  const [copied, setCopied] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [newCompany, setNewCompany] = useState("");
  const [newTypeCompany, setNewTypeCompany] = useState("");
  const [newTypeName, setNewTypeName] = useState("");
  const [newItemCompany, setNewItemCompany] = useState("");
  const [newItemType, setNewItemType] = useState("Main");
  const [newItemName, setNewItemName] = useState("");
  const [deleteCompanyName, setDeleteCompanyName] = useState("");
  const [deleteTypeCompany, setDeleteTypeCompany] = useState("");
  const [deleteTypeName, setDeleteTypeName] = useState("");
  const [deleteItemCompany, setDeleteItemCompany] = useState("");
  const [deleteItemType, setDeleteItemType] = useState("Main");
  const [deleteItemName, setDeleteItemName] = useState("");
  const [saveMessage, setSaveMessage] = useState("Saved automatically");

  useEffect(() => {
    saveState({
      storeName,
      storeAddress,
      orderDate,
      catalog,
      values,
    });
    setSaveMessage("Saved automatically");
  }, [storeName, storeAddress, orderDate, catalog, values]);

  const outputPrompt = useMemo(() => {
    return buildChatGptPrompt(storeName, storeAddress, orderDate, catalog, values);
  }, [storeName, storeAddress, orderDate, catalog, values]);

  const updateQuantity = (key, quantity) => {
    setValues((prev) => ({
      ...prev,
      [key]: { quantity },
    }));
  };

  const addCompany = () => {
    const name = newCompany.trim();
    if (!name) return;
    if (catalog.some((company) => company.company.toLowerCase() === name.toLowerCase())) return;

    const nextCatalog = catalog.concat([{ company: name, groups: [{ type: "Main", items: [] }] }]);
    setCatalog(nextCatalog);
    setValues((prev) => mergeValues(nextCatalog, prev));
    setNewCompany("");
    setSaveMessage("Saved automatically");
  };

  const addType = () => {
    const companyName = newTypeCompany.trim();
    const typeName = newTypeName.trim();
    if (!companyName || !typeName) return;

    const nextCatalog = catalog.map((company) => {
      if (company.company !== companyName) return company;
      if (company.groups.some((group) => group.type.toLowerCase() === typeName.toLowerCase())) return company;
      return {
        ...company,
        groups: company.groups.concat([{ type: typeName, items: [] }]),
      };
    });

    setCatalog(nextCatalog);
    setValues((prev) => mergeValues(nextCatalog, prev));
    setNewTypeName("");
    setSaveMessage("Saved automatically");
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
          return {
            ...group,
            items: group.items.concat([itemName]),
          };
        }),
      };
    });

    setCatalog(nextCatalog);
    setValues((prev) => {
      const nextValues = mergeValues(nextCatalog, prev);
      nextValues[keyFor(companyName, newItemType, itemName)] = { quantity: "0" };
      return nextValues;
    });
    setNewItemName("");
    setSaveMessage("Saved automatically");
  };

  const deleteCompany = () => {
    const name = deleteCompanyName.trim();
    if (!name) return;
    const nextCatalog = catalog.filter((company) => company.company !== name);
    if (nextCatalog.length === catalog.length) return;
    setCatalog(nextCatalog);
    setValues((prev) => mergeValues(nextCatalog, prev));
    setDeleteCompanyName("");
    setSaveMessage("Saved automatically");
  };

  const deleteType = () => {
    const companyName = deleteTypeCompany.trim();
    const typeName = deleteTypeName.trim();
    if (!companyName || !typeName) return;

    const nextCatalog = catalog.map((company) => {
      if (company.company !== companyName) return company;
      return {
        ...company,
        groups: company.groups.filter((group) => group.type !== typeName),
      };
    });

    setCatalog(nextCatalog);
    setValues((prev) => mergeValues(nextCatalog, prev));
    setDeleteTypeName("");
    setSaveMessage("Saved automatically");
  };

  const deleteItem = () => {
    const companyName = deleteItemCompany.trim();
    const typeName = deleteItemType.trim();
    const itemName = deleteItemName.trim();
    if (!companyName || !typeName || !itemName) return;

    const nextCatalog = catalog.map((company) => {
      if (company.company !== companyName) return company;
      return {
        ...company,
        groups: company.groups.map((group) => {
          if (group.type !== typeName) return group;
          return {
            ...group,
            items: group.items.filter((item) => item !== itemName),
          };
        }),
      };
    });

    setCatalog(nextCatalog);
    setValues((prev) => mergeValues(nextCatalog, prev));
    setDeleteItemName("");
    setSaveMessage("Saved automatically");
  };

  const copyToClipboard = async () => {
    const text = outputPrompt || "No items selected.";
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      setCopied(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 text-gray-900">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 rounded-3xl bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold">Simple Order Builder</h1>
                <p className="mt-2 text-sm text-gray-600">
                  Set quantities from 0 to 20. If quantity is 0, the item stays out. If quantity is above 0, it is included automatically.
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={() => {
                    setShowAdd((prev) => !prev);
                    setShowDelete(false);
                  }}
                  className="rounded-2xl bg-black px-4 py-3 text-sm font-medium text-white"
                >
                  {showAdd ? "Close add panel" : "Add company / type / item"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowDelete((prev) => !prev);
                    setShowAdd(false);
                  }}
                  className="rounded-2xl border border-red-200 bg-white px-4 py-3 text-sm font-medium text-red-700"
                >
                  {showDelete ? "Close delete panel" : "Delete company / type / item"}
                </button>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <div>
                <label className="mb-1 block text-sm font-semibold">Store name</label>
                <input
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  placeholder="Store name"
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold">Store address</label>
                <input
                  value={storeAddress}
                  onChange={(e) => setStoreAddress(e.target.value)}
                  placeholder="Store address"
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold">Date</label>
                <input
                  type="date"
                  value={orderDate}
                  onChange={(e) => setOrderDate(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none"
                />
              </div>
            </div>

            <div className="text-xs text-green-700">{saveMessage}</div>
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
                <button type="button" onClick={addCompany} className="mt-3 w-full rounded-xl bg-black px-3 py-2 text-sm text-white">
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
                    const company = catalog.find((entry) => entry.company === companyName);
                    setNewItemType(company && company.groups && company.groups[0] ? company.groups[0].type : "Main");
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

          {showDelete && (
            <div className="mt-5 grid gap-4 rounded-2xl border border-red-200 p-4 md:grid-cols-3">
              <div className="rounded-2xl border border-red-200 p-3">
                <h2 className="mb-3 text-sm font-semibold text-red-700">Delete company</h2>
                <select
                  value={deleteCompanyName}
                  onChange={(e) => setDeleteCompanyName(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
                >
                  <option value="">Select company</option>
                  {catalog.map((company) => (
                    <option key={company.company} value={company.company}>
                      {company.company}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={deleteCompany}
                  className="mt-3 w-full rounded-xl bg-red-600 px-3 py-2 text-sm text-white"
                >
                  Delete company
                </button>
              </div>

              <div className="rounded-2xl border border-red-200 p-3">
                <h2 className="mb-3 text-sm font-semibold text-red-700">Delete type</h2>
                <select
                  value={deleteTypeCompany}
                  onChange={(e) => {
                    const companyName = e.target.value;
                    setDeleteTypeCompany(companyName);
                    const company = catalog.find((entry) => entry.company === companyName);
                    setDeleteTypeName(company && company.groups && company.groups[0] ? company.groups[0].type : "");
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
                  value={deleteTypeName}
                  onChange={(e) => setDeleteTypeName(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
                >
                  <option value="">Select type</option>
                  {(catalog.find((company) => company.company === deleteTypeCompany)?.groups || []).map((group) => (
                    <option key={group.type} value={group.type}>
                      {group.type}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={deleteType}
                  className="mt-3 w-full rounded-xl bg-red-600 px-3 py-2 text-sm text-white"
                >
                  Delete type
                </button>
              </div>

              <div className="rounded-2xl border border-red-200 p-3">
                <h2 className="mb-3 text-sm font-semibold text-red-700">Delete item</h2>
                <select
                  value={deleteItemCompany}
                  onChange={(e) => {
                    const companyName = e.target.value;
                    setDeleteItemCompany(companyName);
                    const company = catalog.find((entry) => entry.company === companyName);
                    const firstType = company && company.groups && company.groups[0] ? company.groups[0].type : "Main";
                    setDeleteItemType(firstType);
                    setDeleteItemName("");
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
                  value={deleteItemType}
                  onChange={(e) => {
                    setDeleteItemType(e.target.value);
                    setDeleteItemName("");
                  }}
                  className="mb-2 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
                >
                  {(catalog.find((company) => company.company === deleteItemCompany)?.groups || [{ type: "Main", items: [] }]).map(
                    (group) => (
                      <option key={group.type} value={group.type}>
                        {group.type}
                      </option>
                    ),
                  )}
                </select>
                <select
                  value={deleteItemName}
                  onChange={(e) => setDeleteItemName(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
                >
                  <option value="">Select item</option>
                  {(
                    catalog
                      .find((company) => company.company === deleteItemCompany)
                      ?.groups.find((group) => group.type === deleteItemType)?.items || []
                  ).map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={deleteItem}
                  className="mt-3 w-full rounded-xl bg-red-600 px-3 py-2 text-sm text-white"
                >
                  Delete item
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
                          const entry = values[key] || { quantity: "0" };

                          return (
                            <div key={key} className="flex items-center gap-3 rounded-xl border border-gray-200 p-3">
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
              <h2 className="text-xl font-semibold">Prompt preview</h2>
              <textarea
                readOnly
                value={outputPrompt}
                className="mt-4 min-h-[520px] w-full rounded-2xl border border-gray-300 p-3 font-mono text-sm outline-none"
              />

              <button
                type="button"
                onClick={copyToClipboard}
                className="mt-4 w-full rounded-2xl bg-black px-4 py-3 text-sm font-medium text-white"
              >
                {copied ? "Copied" : "Copy full prompt"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
