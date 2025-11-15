// Dashboard footer

export const DashboardFooter = () => {
  return (
    <footer className="border-t mt-12 py-8 bg-white">
      <div className="container grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        <div>
          <h4 className="font-bold">SkillShare</h4>
          <p className="text-sm text-muted-foreground mt-2">Connecting students with campus mentors and peers for hands-on learning.</p>
        </div>

        <div>
          <h5 className="font-semibold">Product</h5>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            <li><a href="#">Explore</a></li>
            <li><a href="#">Connections</a></li>
            <li><a href="#">Messages</a></li>
          </ul>
        </div>

        <div>
          <h5 className="font-semibold">Company</h5>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            <li><a href="#">About</a></li>
            <li><a href="#">Contact</a></li>
            <li><a href="#">Privacy</a></li>
          </ul>
        </div>

      </div>

      <div className="container mt-6 text-sm text-muted-foreground text-center">© {new Date().getFullYear()} SkillShare. All rights reserved.</div>
    </footer>
  );
};

export default DashboardFooter;
