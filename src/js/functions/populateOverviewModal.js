export function populateOverviewModal() {
    const data = window.allItems;

    const pivot = document.getElementById("overviewContainer")

    const departmentGroups = data.reduce((groups, item) => {
        const dept = item.department;
        if (!groups[dept]) groups[dept] = [];
        groups[dept].push(item);
        return groups;
    }, {});

    Object.entries(departmentGroups).forEach(([dept,items]) => {
        const wrapper = document.createElement("div");
        wrapper.style.marginBottom = "10px";
        const toggleButton = document.createElement("button");
        toggleButton.textContent = "+";

        const title = document.createElement("strong");
        title.textContent = ` ${dept} (${items.length})`;

        const categoryContainer = document.createElement("div");
        categoryContainer.style.display = "none";

        toggleButton.addEventListener("click", () => {
            const visible = categoryContainer.style.display === "block";
            categoryContainer.style.display = visible ? "none" : "block";
            toggleButton.textContent = visible ? "+" : "-";
        });

            const categoryGroups = items.reduce((cat, item) => {
                if (!cat[item.category]) cat[item.category] = [];
                cat[item.category].push(item);
                return cat;
            }, {})

            Object.entries(categoryGroups).forEach(([acc, items]) => {
                const catwrapper = document.createElement("div");
                catwrapper.style.marginTop = "5px";
                catwrapper.style.marginLeft = "25px";
        
                const cattoggleButton = document.createElement("button");
                cattoggleButton.textContent = "+";
        
                const cattitle = document.createElement("strong");
                cattitle.textContent = ` ${acc} (${items.length})`;
        
                const catitemList = document.createElement("div");
                catitemList.style.display = "none";
                catitemList.style.marginLeft = "20px";

                cattoggleButton.addEventListener("click", () => {
                    const visible = catitemList.style.display === "block";
                    catitemList.style.display = visible ? "none" : "block";
                    cattoggleButton.textContent = visible ? "+" : "-";
                });

                const subcategoryGroups = items.reduce((acc, item) => {
                    if (!acc[item.subCategory]) acc[item.subCategory] = [];
                    acc[item.subCategory].push(item);
                    return acc;
                }, {})

                Object.entries(subcategoryGroups).forEach(([subcat, items]) => {
                    const subcatwrapper = document.createElement("div");
                    subcatwrapper.style.marginTop = "5px";
                    subcatwrapper.style.marginLeft = "20px";

                    const subcattoggleButton = document.createElement("button");
                    subcattoggleButton.textContent = "+";

                    const subcattitle = document.createElement("strong");
                    subcattitle.textContent = ` ${subcat} (${items.length})`;

                    const subcatitemList = document.createElement("div");
                    subcatitemList.style.display = "none";
                    subcatitemList.style.marginLeft = "20px";

                    subcattoggleButton.addEventListener("click", () => {
                        const visible = subcatitemList.style.display === "block";
                        subcatitemList.style.display = visible ? "none" : "block";
                        subcattoggleButton.textContent = visible ? "+" : "-";
                    });

                    const nameGroups = items.reduce((acc, item) => {
                        if (!acc[item.productName]) acc[item.productName] = [];
                        acc[item.productName].push(item);
                        return acc;
                    }, {})

                    Object.entries(nameGroups).forEach(([prodName, items]) => {
                        const namewrapper = document.createElement("div");
                        namewrapper.style.marginTop = "5px";
                        namewrapper.style.marginLeft = "20px";

                        const nametoggleButton = document.createElement("button");
                        nametoggleButton.textContent = "+";

                        const nametitle = document.createElement("strong");
                        nametitle.textContent = ` ${prodName} (${items.length})`;

                        const nameitemList = document.createElement("div");
                        nameitemList.style.display = "none";
                        nameitemList.style.marginLeft = "25px";

                        nametoggleButton.addEventListener("click", () => {
                            const visible = nameitemList.style.display === "block";
                            nameitemList.style.display = visible ? "none" : "block";
                            nametoggleButton.textContent = visible ? "+" : "-";
                        });

                        nameitemList.innerHTML = items.map(item => 
                            `<div>${item.id}</div>`
                        ).join("");

                        namewrapper.appendChild(nametoggleButton);
                        namewrapper.appendChild(nametitle);
                        namewrapper.appendChild(nameitemList);
                        subcatitemList.appendChild(namewrapper);
                    })

                    subcatwrapper.appendChild(subcattoggleButton);
                    subcatwrapper.appendChild(subcattitle);
                    subcatwrapper.appendChild(subcatitemList);
                    catitemList.appendChild(subcatwrapper);
                })

                catwrapper.appendChild(cattoggleButton);
                catwrapper.appendChild(cattitle);
                catwrapper.appendChild(catitemList);
                categoryContainer.appendChild(catwrapper);
            })
        
        wrapper.appendChild(toggleButton);
        wrapper.appendChild(title);
        wrapper.appendChild(categoryContainer);
        pivot.appendChild(wrapper);
    })
}