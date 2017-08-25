/*
 *
 * HomePage
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect';
import { size } from 'lodash';
import Helmet from 'react-helmet';
import { router } from 'app';
import { makeSelectLoading, makeSelectMenu, makeSelectModels } from 'containers/App/selectors';

import Form from 'containers/Form';

// Design
import ContentHeader from 'components/ContentHeader';
import EmptyContentTypeView from 'components/EmptyContentTypeView';
import TableList from 'components/TableList';

import selectHomePage from './selectors';
import styles from './styles.scss';

export class HomePage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);

    this.popUpHeaderNavLinks = [
      { name: 'baseSettings', message: 'popUpForm.navContainer.base' },
      { name: 'advancedSettings', message: 'popUpForm.navContainer.advanced' },
    ];
  }

  toggleModal = () => {
    const locationHash = this.props.location.hash ? '' : '#create::contentType::baseSettings';
    router.push(`plugins/content-type-builder/${locationHash}`);
  }

  renderTableListComponent = () => {
    const availableNumber = size(this.props.models);
    const title = availableNumber > 1 ? 'table.contentType.title.plural'
      : 'table.contentType.title.singular';
    return (
      <TableList
        availableNumber={availableNumber}
        title={title}
        buttonLabel={'button.contentType.add'}
        handleButtonClick={this.toggleModal}
        rowItems={this.props.models}
      />
    );
  }


  render() {
    const component = size(this.props.models) === 0 ?
      <EmptyContentTypeView handleButtonClick={this.toggleModal} />
        : this.renderTableListComponent();

    return (
      <div className={styles.homePage}>
        <Helmet
          title="HomePage"
          meta={[
            { name: 'description', content: 'Description of HomePage' },
          ]}
        />
        <ContentHeader
          name={'home.contentTypeBuilder.name'}
          description={'home.contentTypeBuilder.description'}
          noMargin
        />
        {component}
        <Form
          hash={this.props.location.hash}
          toggle={this.toggleModal}
          routePath={this.props.route.path}
          popUpHeaderNavLinks={this.popUpHeaderNavLinks}
          menuData={this.props.menu}
        />
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  homePage: selectHomePage(),
  modelsLoading: makeSelectLoading(),
  models: makeSelectModels(),
  menu: makeSelectMenu(),
});

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {},
    dispatch,
  );
};

HomePage.propTypes =  {
  // homePage: React.PropTypes.object.isRequired,
  location: React.PropTypes.object,
  menu: React.PropTypes.array,
  models: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.array,
  ]),
  // modelsLoading: React.PropTypes.bool,
  route: React.PropTypes.object,
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
