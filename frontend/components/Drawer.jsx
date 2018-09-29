import React from 'react';
import Button from './Button';
import './Drawer.css';

class Drawer extends React.Component {
  constructor(props) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
  }

  componentDidMount() {
    const {
      openDrawer,
      fetchEntitiesRequest,
    } = this.props;

    openDrawer(this.drawerProps());
    fetchEntitiesRequest();
  }

  componentDidUpdate(prevProps) {
    const {
      openDrawer,
      fetchEntitiesRequest,
      location: { pathname },
    } = this.props;

    if (pathname !== prevProps.location.pathname) {
      openDrawer(this.drawerProps());
      fetchEntitiesRequest();
    }
  }

  drawerProps() {
    const { match: { params } } = this.props;
    const drawerProps = { drawerType: 'favorites' };

    if (params.messageSlug) {
      drawerProps.drawerType = 'thread';
      drawerProps.drawerSlug = params.messageSlug;
    }

    if (params.userSlug) {
      drawerProps.drawerType = 'team';
      drawerProps.drawerSlug = params.userSlug;
    }

    return drawerProps;
  }

  handleClose() {
    const {
      closeDrawer,
      history,
      match: { params: { 0: chatPath, workspaceSlug } },
    } = this.props;

    closeDrawer();
    history.push(`/${workspaceSlug}/${chatPath}`);
  }

  render() {
    const { drawerTitle, render } = this.props;
    const { drawerType } = this.drawerProps();

    let classNames = 'Drawer';
    if (drawerType) classNames += ` Drawer__${drawerType}`;

    return (
      <aside className={classNames}>
        <header className="Drawer__header">
          <div className="Drawer__headings">
            {drawerTitle && (
              <h4 className="Drawer__title">
                {drawerTitle}
              </h4>
            )}
          </div>

          <Button unStyled buttonFor="close" onClick={this.handleClose}>
            &#10006;
          </Button>
        </header>

        <div className="Drawer__body">
          {render()}
        </div>
      </aside>
    );
  }
}

export default Drawer;