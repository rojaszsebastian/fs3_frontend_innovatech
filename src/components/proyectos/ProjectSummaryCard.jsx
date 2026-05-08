export default function ProjectSummaryCard({ projects }) {

    return (

        <div className="card shadow-sm">

            <div className="card-body">

                <h5 className="card-title">
                    Gestión de Proyectos
                </h5>

                <p>
                    Proyectos activos: {projects?.length || 0}
                </p>

            </div>

        </div>
    );
}