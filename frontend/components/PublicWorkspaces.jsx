import React from 'react';
import Button from './Button';
import PublicWorkspacesItem from './PublicWorkspacesItem';
import './PublicWorkspaces.css';

const PublicWorkspaces = ({
  workspaces,
  isLoggedIn,
  createWorkspaceSubRequest,
  updateWorkspaceSubRequest,
  currentUser,
  openModal,
}) => {
  if (!workspaces || !isLoggedIn) return null;

  return (
    <section className="PublicWorkspaces">
      <header className="PublicWorkspaces__header">
        <h2 className="PublicWorkspaces__title">
          Select a Workspace
        </h2>
        <div className="PublicWorkspaces__subtitle">
          You can also&nbsp;
          <Button
            onClick={() => openModal('MODAL_FORM_WORKSPACE')}
            buttonFor="create-workspace"
            unStyled
          >
            create a workspace
          </Button>
        </div>
      </header>
      <div className="PublicWorkspaces__list" role="list">
        {workspaces.map(workspace => (
          <PublicWorkspacesItem
            key={workspace.id}
            currentUser={currentUser}
            createWorkspaceSubRequest={createWorkspaceSubRequest}
            updateWorkspaceSubRequest={updateWorkspaceSubRequest}
            workspace={workspace}
          />
        ))}
      </div>
    </section>
  );
};

export default PublicWorkspaces;
