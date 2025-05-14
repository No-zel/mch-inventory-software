export function populateOverviewModal() {
    const data = window.allItems;

    const pivot = document.getElementById("overviewContainer")

    const categoryGroups = data.reduce((groups, item) => {
        const category = item.category;
        if (!groups[category]) groups[category] = [];
        groups[category].push(item);
        return groups;
    }, {});

    Object.entries(categoryGroups).forEach(([cat,items]) => {
        const wrapper = document.createElement("div");
        wrapper.style.marginBottom = "15px";
        const toggleButton = document.createElement("button");
        toggleButton.textContent = "+";

        const title = document.createElement("strong");
        title.textContent = ` ${cat} (${items.length})`;

        const categoryContainer = document.createElement("div");
        categoryContainer.style.display = "none";

        toggleButton.addEventListener("click", () => {
            const visible = categoryContainer.style.display === "block";
            categoryContainer.style.display = visible ? "none" : "block";
            toggleButton.textContent = visible ? "+" : "-";

            if (!visible) {
                toggleButton.style.backgroundColor = "rgb(44, 44, 44)";
                toggleButton.style.color = "white";
            } else {
                toggleButton.style.backgroundColor = "#f0f0f0";
                toggleButton.style.color = "rgb(44, 44, 44)";
            }
        });

            const subCategoryGroups = items.reduce((subcat, item) => {
                if (!subcat[item.subCategory]) subcat[item.subCategory] = [];
                subcat[item.subCategory].push(item);
                return subcat;
            }, {})

            Object.entries(subCategoryGroups).forEach(([acc, items]) => {
                const subCatwrapper = document.createElement("div");
                subCatwrapper.style.marginTop = "10px";
                subCatwrapper.style.marginLeft = "25px";
        
                const subCatToggleButton = document.createElement("button");
                subCatToggleButton.textContent = "+";
        
                const subCaTtitle = document.createElement("strong");
                subCaTtitle.textContent = ` ${acc} (${items.length})`;
        
                const subCatitemList = document.createElement("div");
                subCatitemList.style.display = "none";
                subCatitemList.style.marginLeft = "20px";

                subCatToggleButton.addEventListener("click", () => {
                    const visible = subCatitemList.style.display === "block";
                    subCatitemList.style.display = visible ? "none" : "block";
                    subCatToggleButton.textContent = visible ? "+" : "-";

                    if (!visible) {
                        subCatToggleButton.style.backgroundColor = "rgb(44, 44, 44)";
                        subCatToggleButton.style.color = "white";
                    } else {
                        subCatToggleButton.style.backgroundColor = "#f0f0f0";
                        subCatToggleButton.style.color = "rgb(44, 44, 44)";
                    }
                });

                const departmentGroup = items.reduce((acc, item) => {
                    if (!acc[item.department]) acc[item.department] = [];
                    acc[item.department].push(item);
                    return acc;
                }, {})

                Object.entries(departmentGroup).forEach(([dept, items]) => {
                    const departmentWrapper = document.createElement("div");
                    departmentWrapper.style.marginTop = "10px";
                    departmentWrapper.style.marginLeft = "25px";

                    const departmentToggleButton = document.createElement("button");
                    departmentToggleButton.textContent = "+";

                    const departmentTitle = document.createElement("strong");
                    departmentTitle.textContent = ` ${dept} (${items.length})`;

                    const departmentItemList = document.createElement("div");
                    departmentItemList.style.display = "none";
                    departmentItemList.style.marginLeft = "20px";

                    departmentToggleButton.addEventListener("click", () => {
                        const visible = departmentItemList.style.display === "block";
                        departmentItemList.style.display = visible ? "none" : "block";
                        departmentToggleButton.textContent = visible ? "+" : "-";

                    if (!visible) {
                        departmentToggleButton.style.backgroundColor = "rgb(44, 44, 44)";
                        departmentToggleButton.style.color = "white";
                    } else {
                        departmentToggleButton.style.backgroundColor = "#f0f0f0";
                        departmentToggleButton.style.color = "rgb(44, 44, 44)";
                    }
                    });

                    departmentItemList.innerHTML = items.map(item => 
                         `<div style="margin-left: 20px;">${item.id}</div>`
                    ).join("");

                    departmentWrapper.appendChild(departmentToggleButton);
                    departmentWrapper.appendChild(departmentTitle);
                    departmentWrapper.appendChild(departmentItemList);
                    subCatitemList.appendChild(departmentWrapper);
                })

                subCatwrapper.appendChild(subCatToggleButton);
                subCatwrapper.appendChild(subCaTtitle);
                subCatwrapper.appendChild(subCatitemList);
                categoryContainer.appendChild(subCatwrapper);
            })
        
        wrapper.appendChild(toggleButton);
        wrapper.appendChild(title);
        wrapper.appendChild(categoryContainer);
        pivot.appendChild(wrapper);
    })
}

// export function populateOverviewModal() {
//     const data = window.allItems;

//     const pivot = document.getElementById("overviewContainer")

//     const departmentGroups = data.reduce((groups, item) => {
//         const dept = item.department;
//         if (!groups[dept]) groups[dept] = [];
//         groups[dept].push(item);
//         return groups;
//     }, {});

//     Object.entries(departmentGroups).forEach(([dept,items]) => {
//         const wrapper = document.createElement("div");
//         wrapper.style.marginBottom = "10px";
//         const toggleButton = document.createElement("button");
//         toggleButton.textContent = "+";

//         const title = document.createElement("strong");
//         title.textContent = ` ${dept} (${items.length})`;

//         const categoryContainer = document.createElement("div");
//         categoryContainer.style.display = "none";

//         toggleButton.addEventListener("click", () => {
//             const visible = categoryContainer.style.display === "block";
//             categoryContainer.style.display = visible ? "none" : "block";
//             toggleButton.textContent = visible ? "+" : "-";
//         });

//             const categoryGroups = items.reduce((cat, item) => {
//                 if (!cat[item.category]) cat[item.category] = [];
//                 cat[item.category].push(item);
//                 return cat;
//             }, {})

//             Object.entries(categoryGroups).forEach(([acc, items]) => {
//                 const catwrapper = document.createElement("div");
//                 catwrapper.style.marginTop = "5px";
//                 catwrapper.style.marginLeft = "25px";
        
//                 const cattoggleButton = document.createElement("button");
//                 cattoggleButton.textContent = "+";
        
//                 const cattitle = document.createElement("strong");
//                 cattitle.textContent = ` ${acc} (${items.length})`;
        
//                 const catitemList = document.createElement("div");
//                 catitemList.style.display = "none";
//                 catitemList.style.marginLeft = "20px";

//                 cattoggleButton.addEventListener("click", () => {
//                     const visible = catitemList.style.display === "block";
//                     catitemList.style.display = visible ? "none" : "block";
//                     cattoggleButton.textContent = visible ? "+" : "-";
//                 });

//                 const subcategoryGroups = items.reduce((acc, item) => {
//                     if (!acc[item.subCategory]) acc[item.subCategory] = [];
//                     acc[item.subCategory].push(item);
//                     return acc;
//                 }, {})

//                 Object.entries(subcategoryGroups).forEach(([subcat, items]) => {
//                     const subcatwrapper = document.createElement("div");
//                     subcatwrapper.style.marginTop = "5px";
//                     subcatwrapper.style.marginLeft = "20px";

//                     const subcattoggleButton = document.createElement("button");
//                     subcattoggleButton.textContent = "+";

//                     const subcattitle = document.createElement("strong");
//                     subcattitle.textContent = ` ${subcat} (${items.length})`;

//                     const subcatitemList = document.createElement("div");
//                     subcatitemList.style.display = "none";
//                     subcatitemList.style.marginLeft = "20px";

//                     subcattoggleButton.addEventListener("click", () => {
//                         const visible = subcatitemList.style.display === "block";
//                         subcatitemList.style.display = visible ? "none" : "block";
//                         subcattoggleButton.textContent = visible ? "+" : "-";
//                     });

//                     const nameGroups = items.reduce((acc, item) => {
//                         if (!acc[item.productName]) acc[item.productName] = [];
//                         acc[item.productName].push(item);
//                         return acc;
//                     }, {})

//                     Object.entries(nameGroups).forEach(([prodName, items]) => {
//                         const namewrapper = document.createElement("div");
//                         namewrapper.style.marginTop = "5px";
//                         namewrapper.style.marginLeft = "20px";

//                         const nametoggleButton = document.createElement("button");
//                         nametoggleButton.textContent = "+";

//                         const nametitle = document.createElement("strong");
//                         nametitle.textContent = ` ${prodName} (${items.length})`;

//                         const nameitemList = document.createElement("div");
//                         nameitemList.style.display = "none";
//                         nameitemList.style.marginLeft = "25px";

//                         nametoggleButton.addEventListener("click", () => {
//                             const visible = nameitemList.style.display === "block";
//                             nameitemList.style.display = visible ? "none" : "block";
//                             nametoggleButton.textContent = visible ? "+" : "-";
//                         });

//                         nameitemList.innerHTML = items.map(item => 
//                             `<div>${item.id}</div>`
//                         ).join("");

//                         namewrapper.appendChild(nametoggleButton);
//                         namewrapper.appendChild(nametitle);
//                         namewrapper.appendChild(nameitemList);
//                         subcatitemList.appendChild(namewrapper);
//                     })

//                     subcatwrapper.appendChild(subcattoggleButton);
//                     subcatwrapper.appendChild(subcattitle);
//                     subcatwrapper.appendChild(subcatitemList);
//                     catitemList.appendChild(subcatwrapper);
//                 })

//                 catwrapper.appendChild(cattoggleButton);
//                 catwrapper.appendChild(cattitle);
//                 catwrapper.appendChild(catitemList);
//                 categoryContainer.appendChild(catwrapper);
//             })
        
//         wrapper.appendChild(toggleButton);
//         wrapper.appendChild(title);
//         wrapper.appendChild(categoryContainer);
//         pivot.appendChild(wrapper);
//     })
// }