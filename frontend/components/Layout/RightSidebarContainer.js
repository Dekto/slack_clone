import { connect } from 'react-redux';
import RightSidebar from './RightSidebar';
import { closeRightSidebar, navigate } from '../../actions/interactiveActions';
import isFetching from '../../util/isFetchingUtil';

const mapStateToProps = state => ({
  isRightSidebarOpen: Boolean(state.ui.rightSidebar),
});

const mapDispatchToProps = dispatch => ({
  closeRightSidebar: () => dispatch(closeRightSidebar()),
  navigate: path => dispatch(navigate({ path })),
});

export default connect(mapStateToProps, mapDispatchToProps)(isFetching('rightSidebar')(RightSidebar));
