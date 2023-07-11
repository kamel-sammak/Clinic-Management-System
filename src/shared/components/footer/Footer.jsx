const Footer = () => {
  return (
    <>
      <footer className="container-fluid bg-dark text-light border-top border-secondary py-4 fixed-bottom">
        {/* <div className="container py-5"></div> */}
        <div className="container">
          <div className="row g-5">
            <div className="col-md-6 text-center text-md-start">
              <p className="mb-md-0">
                &copy;{" "}
                <a className="text-primary" href="#">
                  Clinc Management System
                </a>
                . All Rights Reserved.
              </p>
            </div>
            <div className="col-md-6 text-center text-md-end"></div>
          </div>
        </div>
      </footer>
      {/* <div className="container-fluid bg-dark text-light border-top border-secondary py-4 fixed-bottom">
        <div className="container">
          <div className="row g-5">
            <div className="col-md-6 text-center text-md-start">
              <p className="mb-md-0">
                &copy;{" "}
                <a className="text-primary" href="#">
                  Your Site Name
                </a>
                . All Rights Reserved.
              </p>
            </div>
            <div className="col-md-6 text-center text-md-end"></div>
          </div>
        </div>
      </div> */}
    </>
  );
};

export default Footer;
