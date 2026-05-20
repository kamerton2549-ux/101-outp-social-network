import { useState, useEffect } from "react";
import IndexNavbar from "@/components/index/IndexNavbar";
import IndexHeroAboutSearch, { MEMBERS } from "@/components/index/IndexHeroAboutSearch";
import IndexCommunity from "@/components/index/IndexCommunity";
import IndexFooter from "@/components/index/IndexFooter";

export default function Index() {
  const [activeNav, setActiveNav]   = useState("home");
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchVal, setSearchVal]   = useState("");
  const [filterBn, setFilterBn]     = useState("all");

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const goTo = (id: string) => {
    setActiveNav(id);
    setMobileOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const filteredMembers = MEMBERS.filter(m =>
    (filterBn === "all" || m.bn.includes(filterBn)) &&
    (searchVal === "" || m.name.toLowerCase().includes(searchVal.toLowerCase()) ||
      m.tank.toLowerCase().includes(searchVal.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <IndexNavbar
        scrolled={scrolled}
        activeNav={activeNav}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        goTo={goTo}
      />
      <IndexHeroAboutSearch
        searchVal={searchVal}
        setSearchVal={setSearchVal}
        filterBn={filterBn}
        setFilterBn={setFilterBn}
        filteredMembers={filteredMembers}
      />
      <IndexCommunity />
      <IndexFooter goTo={goTo} />
    </div>
  );
}
