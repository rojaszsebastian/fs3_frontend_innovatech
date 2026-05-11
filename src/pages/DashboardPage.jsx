import NavbarComponent from "../components/layout/NavbarComponent";
import SidebarComponent from "../components/layout/SidebarComponent";
import EmployeeCapacityCard from "../components/rrhh/EmployeeCapacityCard";
import ProjectSummaryCard from "../components/proyectos/ProjectSummaryCard";
import "../styles/dashboard.css";
import "../styles/navbar.css";

export default function DashboardPage() {

    const mockEmployee = {
        nombre: "Sebastian",
        cargo: "Developer",
        capacity: 15
    };

    const mockProjects = [
        { id: 1 },
        { id: 2 }
    ];

    return (

        <div>

            <NavbarComponent />

            <div className="container-fluid">

                <div className="row">

                    <div className="col-2 p-0">
                        <SidebarComponent />
                    </div>

                    <div className="col-10 p-4">

                        <h2 className="mb-4">
                            Inicio
                        </h2>

                        <div className="row g-4">

                            <div className="col-md-6">
                                <EmployeeCapacityCard
                                    employee={mockEmployee}
                                />
                            </div>

                            <div className="col-md-6">
                                <ProjectSummaryCard
                                    projects={mockProjects}
                                />
                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}