import React, { PureComponent } from 'react';

class CreateTicket extends PureComponent {
  render() {
    emptyTicketState = {
      budget: '',
      description: '',
      expanded: false,
      hasCompletedTicket: false,
      initialDescription: '',
      newTicketId: '',
      phases: [],
      phaseValue: '',
      projects: [],
      projectValue: '',
      selectedPhase: {},
      selectedProject: {},
      summary: '',
      ticketType: 'project',
    }

    state = {
      ...this.emptyTicketState
    }

    componentDidMount = () => {
      this.getProjects();
    }

	  componentDidUpdate = (prevProps) => {
      if (prevProps.projects !== this.props.projects) {
        this.getProjects();      
      }

      if (prevProps.selectedProject !== this.props.selectedProject) {
        const { selectedProject } = this.props;
        if (selectedProject['project.name']) {
          this.getPhases(this.state.projects.filter(project => (
            project.name === selectedProject['project.name'] &&
            project.company.name === selectedProject['project.company']
          )));

          this.setState({
            selectedProject: this.state.projects.filter(project => (
              project.name === `${selectedProject['company.name']} — ${selectedProject['project.name']}`)
            )
          });
        }
      }
    }

    getPhases = () => {
      let phases = [];
      const { selectedProject } = this.props;

      this.props.tickets.map(ticket => {
        if (selectedProject['project.name'] === ticket.project.name && selectedProject['company.name'] === ticket.company.name) {
          phases.push({
            path: ticket.phase.path,
            phaseId: ticket.phase.id,
            ticketId: ticket.id
          });
        }
      });

      this.setState({
        phases
      });
    }

    getProjects = () => {
      let projects = [];

      this.props.projects.map(project => {
        projects.push({
          name: `${project.company.name} — ${project.project.name}`,
          id: project.project.id,
          companyId: project.company.id
        });
      });

      this.setState({
        projects
      });
    }

    return (
      <div>

      </div>
    )
  }
}

export default CreateTicket;
