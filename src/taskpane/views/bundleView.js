export function updateBundleViewWithNewBundle(bundle) {
  let bundlesDiv = document.getElementById("bundles");
  let bundleDiv = document.createElement("div");
  bundleDiv.setAttribute("class", "bundle");
  bundleDiv.setAttribute("id", bundle.name);
  bundleDiv.innerHTML = bundle.name;

  let casesCategoryDiv = document.createElement("div");
  casesCategoryDiv.setAttribute("class", "category");
  casesCategoryDiv.innerHTML = "Cases";
  bundleDiv.appendChild(casesCategoryDiv);

  let statutesCategoryDiv = document.createElement("div");
  statutesCategoryDiv.setAttribute("class", "category");
  statutesCategoryDiv.innerHTML = "Statutes";
  bundleDiv.appendChild(statutesCategoryDiv);

  bundlesDiv.appendChild(bundleDiv);
}
