const Sidebar: React.FC = () => {
  return (
    <div className="sidebar">
      <div className="navigation">
        <h3>Navigation</h3>
        <div className="nav-item">
          <a href="#budget">Budget</a>
        </div>
        <div className="nav-item">
          <a href="#location">Location</a>
        </div>
        <div className="nav-item">
          <a href="#purpose">Purpose</a>
        </div>
        <div className="nav-item">
          <a href="#existing-systems">Existing Systems</a>
        </div>
        <div className="nav-item">
          <a href="#configurations">Configurations & Preferences</a>
        </div>
        <div className="nav-item">
          <a href="#goals">Goals & Details</a>
        </div>
        <div className="nav-item">
          <a href="#generate-model">Generate Model</a>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
