<template>
  <div class="modal-card ticket-detail">
    <section class="modal-card-body">
      <div class="text-wrap text-title">
        <span v-if="parseInt(ticket.type) == 0 && additionalDescription" style="padding-right: 15px; font-size: 16px;">{{ $t('ticket_text14') }}</span>
        <span v-if="parseInt(ticket.type) == 0 && !additionalDescription">{{ $t('ticket_text14') }}</span>
        <span v-if="parseInt(ticket.type) == 1">{{ $t('ticket_text52') }}</span>
        <span v-if="additionalDescription && additionalDescription.info === true" style="position: absolute; right: 20px; color: magenta;" @click="isCardModalActive = true">
          <b-icon
            pack="fa-solid"
            icon="circle-info"
            size="is-medium"
            style="width: 1.5rem;"
          />
          <i class="fas fa-expand-alt"></i>
        </span>
      </div>
      <b-table
        :data="tickets"
        :bordered="isBordered"
        :striped="isStriped"
        :narrowed="isNarrowed"
        :hoverable="isHoverable"
        :loading="isLoading"
        :focusable="isFocusable"
        :mobile-cards="hasMobileCards"
        class="check-ticket"
        style="min-height: 210px;"
      >
        <b-table-column
          v-slot="props"
          field="ticketName"
          :label="$t('ticket_text15')"
        >
          <div :class="{long: props.row.ticketName.length > 20, very_long: props.row.ticketName.length > 25}" class="ticket-title">
            {{ props.row.ticketName }}
          </div>
        </b-table-column>

        <b-table-column
          v-slot="props"
          field="description"
          :label="$t('ticket_text16')"
        >
          {{ props.row.description }}
        </b-table-column>

        <b-table-column
          v-slot="props"
          field="twitter"
          :label="$t('ticket_text5')"
        >
          <a :href="props.row.twitter" target="_blank">
            @{{ props.row.twitterAccount }}
          </a>
        </b-table-column>

        <b-table-column
          v-if="parseInt(ticket.type) == 0"
          v-slot="props"
          field="ticketPrice"
          :label="$t('ticket_text18')"
        >
          {{ props.row.ticketPrice }} $FLOW
        </b-table-column>

        <b-table-column
          v-if="parseInt(ticket.type) == 0"
          v-slot="props"
          field="type"
          :label="$t('ticket_text1')"
        >
          {{ props.row.type }}
        </b-table-column>

        <b-table-column
          field="disclose"
          :label="$t('operation_text88')"
        >
          {{ isDiscloseSales ? 'Yes' : 'No' }}
        </b-table-column>

        <b-table-column
          v-if="parseInt(ticket.type) == 1"
          v-slot="props"
          field="ticketWhen"
          :label="parseInt(ticket.type) == 0 ? $t('ticket_text19') : $t('operation_text35')"
        >
          {{ props.row.ticketWhen }}
        </b-table-column>

        <b-table-column
          v-if="parseInt(ticket.type) == 1 && doUkrainianSupport"
          field="hasSupport"
          :label="$t('operation_text146')"
        >
          {{ doUkrainianSupport }}
        </b-table-column>

        <template #empty>
          <div class="has-text-centered">
            {{ $t('ticket_text20') }}
          </div>
        </template>
      </b-table>
      <hr style="background-color: #fff;">
      <div
        style="position: absolute; right: 70px; bottom: 82.5px; color: #999;"
        @click="addComment(false, false)"
      >
        <b-icon
          :pack="isUpvoted ? 'fa-solid': 'fa-regular'"
          icon="heart"
          :type="isUpvoted ? 'is-danger': ''"
          style="font-size: 0.9em; max-width: 15px;"
        />
        {{ upvoteCount }}
      </div>
      <div
        style="position: absolute; right: 25px; bottom: 79px; color: #999;"
        @click="showMessage = commentUpdatable ? true : false"
      >
        <b-icon
          pack="fa-regular"
          icon="comment"
          size="is-medium"
          style="font-size: 0.8em; max-width: 15px;"
        />
        {{ commentCount }}
      </div>
      <div class="buttons" style="display: block; margin-bottom: 0;">
        <b-button v-if="!isTop" type="is-warning" style="margin: 0 6%;" inverted @click="showSchedule">
          {{ $t('operation_text69') }}
        </b-button>
        <b-button type="is-warning" style="margin: 0 6%;" inverted @click="nextEvent">
          {{ $t('operation_text54') }}
        </b-button>
      </div>
    </section>
    <b-tooltip
      v-if="showTooltip"
      type="is-light"
      :auto-close="['outside', 'escape']"
      always
    >
      <template #content>
        <b v-if="parseInt(ticket.type) === 0 && !isScheduleDate" style="font-size: 18px;">{{ startTime }} Start</b>
        <b v-if="parseInt(ticket.type) === 1 && !isScheduleDate" style="font-size: 18px;">{{ $t('operation_text70') }}</b>
        <b v-if="parseInt(ticket.type) === 0 && isScheduleDate" style="font-size: 18px;">{{ $t('ticket_text19') }}</b>
        <b v-if="parseInt(ticket.type) === 1 && isScheduleDate" style="font-size: 18px;">{{ $t('operation_text35') }}</b>
        <b-icon v-if="!isScheduleDate" icon="thumb-up" />
        <b-icon v-if="!isScheduleDate" icon="heart" type="is-danger" />
      </template>
      <b-button style="border-color: transparent; margin-left: 50%; height: 0px;" />
    </b-tooltip>
    <b-datepicker
      v-if="showCalendar"
      v-model="date"
      inline
      :events="events"
      indicators="bars"
      style="position: absolute; left: 5%; width: 90%; top: 8%;"
    />
    <b-button v-if="showCalendar" type="is-danger" @click="hideSchedule">
      Close
    </b-button>
    <b-modal v-model="showMessage" :width="640" scroll="keep" style="z-index: 50">
      <div style="padding: 50px 10px;">
       <b-message
          v-for="(obj, index) in comments"
          v-show="obj.comment"
          :key="index"
          :type="organizer_commented_ids.includes(obj.message_id) ? 'is-info' : ''"
          has-icon
          icon="account"
          aria-close-label="Close message">
          <span v-if="!obj.url">{{ obj.comment }}<br></span>
          <span v-if="obj.url">{{ obj.commentPre }}<br></span>
          <a v-if="obj.url" :href="obj.url" target="_blank" style="color: #7957d5;">{{ obj.url }}<br></a>
          <span v-if="obj.url">{{ obj.commentPost }}<br></span>

          <span style="font-size: 12px;">({{ new Date(parseInt(obj.time) * 1000).toLocaleDateString() }} {{ new Date(parseInt(obj.time) * 1000).toLocaleTimeString() }})</span>
          <b-button
            v-if="commented_ids.includes(obj.message_id)"
            type="is-text"
            @click="commentEditInput = obj.comment; updateMessageIndex = comments.length - (index + 1); showMessageEditor = true"
            style="color: #7957d5; font-size: 14px;"
          >
            [Edit]
          </b-button>
        </b-message>
        <div style="background-color: white; padding: 10px; border-radius: 10px;">
          <b-field label="Add a comment..." style="margin-bottom: 0;">
            <b-input
              v-model="commentInput"
              maxlength="200"
              type="textarea"
            >
            </b-input>
          </b-field>
          <div style="text-align: center;">
            <b-button type="is-info" @click="addComment(true, false)">
              Post
            </b-button>
          </div>
        </div>
      </div>
    </b-modal>
    <b-modal v-model="showMessageEditor" :width="640" scroll="keep" style="z-index: 60">
      <div style="padding: 50px 10px;">
        <div style="background-color: white; padding: 10px; border-radius: 10px;">
          <b-field label="Add a comment..." style="margin-bottom: 0;">
            <b-input
              v-model="commentEditInput"
              maxlength="200"
              type="textarea"
            >
            </b-input>
          </b-field>
          <div style="text-align: center;">
            <b-button type="is-info" @click="addComment(true, true)">
              Edit
            </b-button>
          </div>
        </div>
      </div>
    </b-modal>
    <b-modal v-if="additionalDescription" v-model="isCardModalActive" :width="640" scroll="keep" style="z-index: 50">
      <div class="card">
        <div class="card-image">
          <figure class="image is-4by3">
            <img :src="additionalDescription.infoImage" alt="Image">
          </figure>
        </div>
        <div class="card-content">
          <div class="media">
            <div class="media-content">
              <p class="title is-4">
                {{ additionalDescription.infoDetail.title }}
              </p>
              <p class="subtitle is-6">
                {{ subTitleText0 }}
              </p>
              <p v-if="subTitleText1" class="subtitle is-6">
                {{ subTitleText1 }}
              </p>
              <p v-if="subTitleText2" class="subtitle is-6">
                {{ subTitleText2 }}
              </p>
              <p v-if="subTitleText3" class="subtitle is-6">
                {{ subTitleText3 }}
              </p>
              <p v-if="subTitleText4" class="subtitle is-6">
                {{ subTitleText4 }}
              </p>
              <p v-if="subTitleText5" class="subtitle is-6">
                {{ subTitleText5 }}
              </p>
              <p v-if="subTitleText6" class="subtitle is-6">
                {{ subTitleText6 }}
              </p>
              <p v-if="subTitleText7" class="subtitle is-6">
                {{ subTitleText7 }}
              </p>
              <p v-if="subTitleText8" class="subtitle is-6">
                {{ subTitleText8 }}
              </p>
            </div>
          </div>

          <div class="content">
            <div class="block">
              <b-radio
                v-if="additionalDescription.infoDetail.radio1"
                v-model="radioInfo"
                name="name"
                native-value="first"
                style="min-width: 90vw;"
              >
                {{ additionalDescription.infoDetail.radio1 }}
              </b-radio>
              <b-radio
                v-if="additionalDescription.infoDetail.radio2"
                v-model="radioInfo"
                name="name"
                native-value="second"
                style="min-width: 90vw;"
              >
                {{ additionalDescription.infoDetail.radio2 }}
              </b-radio>
              <b-radio
                v-if="additionalDescription.infoDetail.radio3"
                v-model="radioInfo"
                name="name"
                native-value="third"
                style="min-width: 90vw;"
              >
                {{ additionalDescription.infoDetail.radio3 }}
              </b-radio>
              <b-radio
                v-if="additionalDescription.infoDetail.radio4"
                v-model="radioInfo"
                name="name"
                native-value="fourth"
                style="min-width: 90vw;"
              >
                {{ additionalDescription.infoDetail.radio4 }}
              </b-radio>
            </div>

            <b-collapse
              v-if="additionalDescription.infoDetail.radio1"
              v-model="isOpenCollapseFirst"
              aria-id="contentIdForA11y2"
              class="panel"
              animation="slide"
            >
              <template #trigger>
                <div
                  class="panel-heading"
                  role="button"
                  aria-controls="contentIdForA11y2"
                  :aria-expanded="isOpenCollapseFirst"
                >
                  <strong>{{ additionalDescription.infoDetail.radio1TabTitle }}</strong>
                </div>
              </template>
              <b-tabs position="is-centered" class="block" style="margin: 0;">
                <b-tab-item
                  v-if="additionalDescription.infoDetail.radio1Tab1"
                  :label="additionalDescription.infoDetail.radio1Tab1"
                >
                  <div class="panel-block">
                    <h4>{{ additionalDescription.infoDetail.radio1Tab1Title }}</h4><br>
                    {{ additionalDescription.infoDetail.radio1Tab1Contents }}
                  </div>
                </b-tab-item>
                <b-tab-item
                  v-if="additionalDescription.infoDetail.radio1Tab2"
                  :label="additionalDescription.infoDetail.radio1Tab2"
                >
                  <div class="panel-block">
                    <h4>{{ additionalDescription.infoDetail.radio1Tab2Title }}</h4><br>
                    {{ additionalDescription.infoDetail.radio1Tab2Contents }}
                  </div>
                </b-tab-item>
                <b-tab-item
                  v-if="additionalDescription.infoDetail.radio1Tab3"
                  :label="additionalDescription.infoDetail.radio1Tab3"
                >
                  <div class="panel-block">
                    <h4>{{ additionalDescription.infoDetail.radio1Tab3Title }}</h4><br>
                    {{ additionalDescription.infoDetail.radio1Tab3Contents }}
                  </div>
                </b-tab-item>
                <b-tab-item
                  v-if="additionalDescription.infoDetail.radio1Tab4"
                  :label="additionalDescription.infoDetail.radio1Tab4"
                >
                  <div class="panel-block">
                    <h4>{{ additionalDescription.infoDetail.radio1Tab4Title }}</h4><br>
                    {{ additionalDescription.infoDetail.radio1Tab4Contents }}
                  </div>
                </b-tab-item>
                <b-tab-item
                  v-if="additionalDescription.infoDetail.radio1Tab5"
                  :label="additionalDescription.infoDetail.radio1Tab5"
                >
                  <div class="panel-block">
                    <h4>{{ additionalDescription.infoDetail.radio1Tab5Title }}</h4><br>
                    {{ additionalDescription.infoDetail.radio1Tab5Contents }}
                  </div>
                </b-tab-item>
                <b-tab-item
                  v-if="additionalDescription.infoDetail.radio1Tab6"
                  :label="additionalDescription.infoDetail.radio1Tab6"
                >
                  <div class="panel-block">
                    <h4>{{ additionalDescription.infoDetail.radio1Tab6Title }}</h4><br>
                    {{ additionalDescription.infoDetail.radio1Tab6Contents }}
                  </div>
                </b-tab-item>
                <b-tab-item
                  v-if="additionalDescription.infoDetail.radio1Tab7"
                  :label="additionalDescription.infoDetail.radio1Tab7"
                >
                  <div class="panel-block">
                    <h4>{{ additionalDescription.infoDetail.radio1Tab7Title }}</h4><br>
                    {{ additionalDescription.infoDetail.radio1Tab7Contents }}
                  </div>
                </b-tab-item>
                <b-tab-item
                  v-if="additionalDescription.infoDetail.radio1Tab8"
                  :label="additionalDescription.infoDetail.radio1Tab8"
                >
                  <div class="panel-block">
                    <h4>{{ additionalDescription.infoDetail.radio1Tab8Title }}</h4><br>
                    {{ additionalDescription.infoDetail.radio1Tab8Contents }}
                  </div>
                </b-tab-item>
              </b-tabs>
            </b-collapse>
            <b-collapse
              v-if="additionalDescription.infoDetail.radio2"
              v-model="isOpenCollapseSecond"
              aria-id="contentIdForA11y2"
              class="panel"
              animation="slide"
            >
              <template #trigger>
                <div
                  class="panel-heading"
                  role="button"
                  aria-controls="contentIdForA11y2"
                  :aria-expanded="isOpenCollapseSecond"
                >
                  <strong>{{ additionalDescription.infoDetail.radio2TabTitle }}</strong>
                </div>
              </template>
              <b-tabs position="is-centered" class="block" style="margin: 0;">
                <b-tab-item
                  v-if="additionalDescription.infoDetail.radio2Tab1"
                  :label="additionalDescription.infoDetail.radio2Tab1"
                >
                  <div class="panel-block">
                    <h4>{{ additionalDescription.infoDetail.radio2Tab1Title }}</h4><br>
                    {{ additionalDescription.infoDetail.radio2Tab1Contents }}
                  </div>
                </b-tab-item>
                <b-tab-item
                  v-if="additionalDescription.infoDetail.radio2Tab2"
                  :label="additionalDescription.infoDetail.radio2Tab2"
                >
                  <div class="panel-block">
                    <h4>{{ additionalDescription.infoDetail.radio2Tab2Title }}</h4><br>
                    {{ additionalDescription.infoDetail.radio2Tab2Contents }}
                  </div>
                </b-tab-item>
                <b-tab-item
                  v-if="additionalDescription.infoDetail.radio2Tab3"
                  :label="additionalDescription.infoDetail.radio2Tab3"
                >
                  <div class="panel-block">
                    <h4>{{ additionalDescription.infoDetail.radio2Tab3Title }}</h4><br>
                    {{ additionalDescription.infoDetail.radio2Tab3Contents }}
                  </div>
                </b-tab-item>
                <b-tab-item
                  v-if="additionalDescription.infoDetail.radio2Tab4"
                  :label="additionalDescription.infoDetail.radio2Tab4"
                >
                  <div class="panel-block">
                    <h4>{{ additionalDescription.infoDetail.radio2Tab4Title }}</h4><br>
                    {{ additionalDescription.infoDetail.radio2Tab4Contents }}
                  </div>
                </b-tab-item>
                <b-tab-item
                  v-if="additionalDescription.infoDetail.radio2Tab5"
                  :label="additionalDescription.infoDetail.radio2Tab5"
                >
                  <div class="panel-block">
                    <h4>{{ additionalDescription.infoDetail.radio2Tab5Title }}</h4><br>
                    {{ additionalDescription.infoDetail.radio2Tab5Contents }}
                  </div>
                </b-tab-item>
                <b-tab-item
                  v-if="additionalDescription.infoDetail.radio2Tab6"
                  :label="additionalDescription.infoDetail.radio2Tab6"
                >
                  <div class="panel-block">
                    <h4>{{ additionalDescription.infoDetail.radio2Tab6Title }}</h4><br>
                    {{ additionalDescription.infoDetail.radio2Tab6Contents }}
                  </div>
                </b-tab-item>
                <b-tab-item
                  v-if="additionalDescription.infoDetail.radio2Tab7"
                  :label="additionalDescription.infoDetail.radio2Tab7"
                >
                  <div class="panel-block">
                    <h4>{{ additionalDescription.infoDetail.radio2Tab7Title }}</h4><br>
                    {{ additionalDescription.infoDetail.radio2Tab7Contents }}
                  </div>
                </b-tab-item>
                <b-tab-item
                  v-if="additionalDescription.infoDetail.radio2Tab8"
                  :label="additionalDescription.infoDetail.radio2Tab8"
                >
                  <div class="panel-block">
                    <h4>{{ additionalDescription.infoDetail.radio2Tab8Title }}</h4><br>
                    {{ additionalDescription.infoDetail.radio2Tab8Contents }}
                  </div>
                </b-tab-item>
              </b-tabs>
            </b-collapse>
            <b-collapse
              v-if="additionalDescription.infoDetail.radio3"
              v-model="isOpenCollapseThird"
              aria-id="contentIdForA11y2"
              class="panel"
              animation="slide"
            >
              <template #trigger>
                <div
                  class="panel-heading"
                  role="button"
                  aria-controls="contentIdForA11y2"
                  :aria-expanded="isOpenCollapseThird"
                >
                  <strong>{{ additionalDescription.infoDetail.radio3TabTitle }}</strong>
                </div>
              </template>
              <b-tabs position="is-centered" class="block" style="margin: 0;">
                <b-tab-item
                  v-if="additionalDescription.infoDetail.radio3Tab1"
                  :label="additionalDescription.infoDetail.radio3Tab1"
                >
                  <div class="panel-block">
                    <h4>{{ additionalDescription.infoDetail.radio3Tab1Title }}</h4><br>
                    {{ additionalDescription.infoDetail.radio3Tab1Contents }}
                  </div>
                </b-tab-item>
                <b-tab-item
                  v-if="additionalDescription.infoDetail.radio3Tab2"
                  :label="additionalDescription.infoDetail.radio3Tab2"
                >
                  <div class="panel-block">
                    <h4>{{ additionalDescription.infoDetail.radio3Tab2Title }}</h4><br>
                    {{ additionalDescription.infoDetail.radio3Tab2Contents }}
                  </div>
                </b-tab-item>
                <b-tab-item
                  v-if="additionalDescription.infoDetail.radio3Tab3"
                  :label="additionalDescription.infoDetail.radio3Tab3"
                >
                  <div class="panel-block">
                    <h4>{{ additionalDescription.infoDetail.radio3Tab3Title }}</h4><br>
                    {{ additionalDescription.infoDetail.radio3Tab3Contents }}
                  </div>
                </b-tab-item>
                <b-tab-item
                  v-if="additionalDescription.infoDetail.radio3Tab4"
                  :label="additionalDescription.infoDetail.radio3Tab4"
                >
                  <div class="panel-block">
                    <h4>{{ additionalDescription.infoDetail.radio3Tab4Title }}</h4><br>
                    {{ additionalDescription.infoDetail.radio3Tab4Contents }}
                  </div>
                </b-tab-item>
                <b-tab-item
                  v-if="additionalDescription.infoDetail.radio3Tab5"
                  :label="additionalDescription.infoDetail.radio3Tab5"
                >
                  <div class="panel-block">
                    <h4>{{ additionalDescription.infoDetail.radio3Tab5Title }}</h4><br>
                    {{ additionalDescription.infoDetail.radio3Tab5Contents }}
                  </div>
                </b-tab-item>
                <b-tab-item
                  v-if="additionalDescription.infoDetail.radio3Tab6"
                  :label="additionalDescription.infoDetail.radio3Tab6"
                >
                  <div class="panel-block">
                    <h4>{{ additionalDescription.infoDetail.radio3Tab6Title }}</h4><br>
                    {{ additionalDescription.infoDetail.radio3Tab6Contents }}
                  </div>
                </b-tab-item>
                <b-tab-item
                  v-if="additionalDescription.infoDetail.radio3Tab7"
                  :label="additionalDescription.infoDetail.radio3Tab7"
                >
                  <div class="panel-block">
                    <h4>{{ additionalDescription.infoDetail.radio3Tab7Title }}</h4><br>
                    {{ additionalDescription.infoDetail.radio3Tab7Contents }}
                  </div>
                </b-tab-item>
                <b-tab-item
                  v-if="additionalDescription.infoDetail.radio3Tab8"
                  :label="additionalDescription.infoDetail.radio3Tab8"
                >
                  <div class="panel-block">
                    <h4>{{ additionalDescription.infoDetail.radio3Tab8Title }}</h4><br>
                    {{ additionalDescription.infoDetail.radio3Tab8Contents }}
                  </div>
                </b-tab-item>
              </b-tabs>
            </b-collapse>
            <b-collapse
              v-if="additionalDescription.infoDetail.radio4"
              v-model="isOpenCollapseFourth"
              aria-id="contentIdForA11y2"
              class="panel"
              animation="slide"
            >
              <template #trigger>
                <div
                  class="panel-heading"
                  role="button"
                  aria-controls="contentIdForA11y2"
                  :aria-expanded="isOpenCollapseFourth"
                >
                  <strong>{{ additionalDescription.infoDetail.radio4TabTitle }}</strong>
                </div>
              </template>
              <b-tabs position="is-centered" class="block" style="margin: 0;">
                <b-tab-item
                  v-if="additionalDescription.infoDetail.radio4Tab1"
                  :label="additionalDescription.infoDetail.radio4Tab1"
                >
                  <div class="panel-block">
                    <h4>{{ additionalDescription.infoDetail.radio4Tab1Title }}</h4><br>
                    {{ additionalDescription.infoDetail.radio4Tab1Contents }}
                  </div>
                </b-tab-item>
                <b-tab-item
                  v-if="additionalDescription.infoDetail.radio4Tab2"
                  :label="additionalDescription.infoDetail.radio4Tab2"
                >
                  <div class="panel-block">
                    <h4>{{ additionalDescription.infoDetail.radio4Tab2Title }}</h4><br>
                    {{ additionalDescription.infoDetail.radio4Tab2Contents }}
                  </div>
                </b-tab-item>
                <b-tab-item
                  v-if="additionalDescription.infoDetail.radio4Tab3"
                  :label="additionalDescription.infoDetail.radio4Tab3"
                >
                  <div class="panel-block">
                    <h4>{{ additionalDescription.infoDetail.radio4Tab3Title }}</h4><br>
                    {{ additionalDescription.infoDetail.radio4Tab3Contents }}
                  </div>
                </b-tab-item>
                <b-tab-item
                  v-if="additionalDescription.infoDetail.radio4Tab4"
                  :label="additionalDescription.infoDetail.radio4Tab4"
                >
                  <div class="panel-block">
                    <h4>{{ additionalDescription.infoDetail.radio4Tab4Title }}</h4><br>
                    {{ additionalDescription.infoDetail.radio4Tab4Contents }}
                  </div>
                </b-tab-item>
                <b-tab-item
                  v-if="additionalDescription.infoDetail.radio4Tab5"
                  :label="additionalDescription.infoDetail.radio4Tab5"
                >
                  <div class="panel-block">
                    <h4>{{ additionalDescription.infoDetail.radio4Tab5Title }}</h4><br>
                    {{ additionalDescription.infoDetail.radio4Tab5Contents }}
                  </div>
                </b-tab-item>
                <b-tab-item
                  v-if="additionalDescription.infoDetail.radio4Tab6"
                  :label="additionalDescription.infoDetail.radio4Tab6"
                >
                  <div class="panel-block">
                    <h4>{{ additionalDescription.infoDetail.radio4Tab6Title }}</h4><br>
                    {{ additionalDescription.infoDetail.radio4Tab6Contents }}
                  </div>
                </b-tab-item>
                <b-tab-item
                  v-if="additionalDescription.infoDetail.radio4Tab7"
                  :label="additionalDescription.infoDetail.radio4Tab7"
                >
                  <div class="panel-block">
                    <h4>{{ additionalDescription.infoDetail.radio4Tab7Title }}</h4><br>
                    {{ additionalDescription.infoDetail.radio4Tab7Contents }}
                  </div>
                </b-tab-item>
                <b-tab-item
                  v-if="additionalDescription.infoDetail.radio4Tab7"
                  :label="additionalDescription.infoDetail.radio4Tab7"
                >
                  <div class="panel-block">
                    <h4>{{ additionalDescription.infoDetail.radio4Tab8Title }}</h4><br>
                    {{ additionalDescription.infoDetail.radio4Tab8Contents }}
                  </div>
                </b-tab-item>
              </b-tabs>
            </b-collapse>
            <hr>
            <div v-if="linkTitle0" class="link_frame">
              <h5>{{ linkTitle0 }}</h5>
              <a :href="linkUrl0" target="_blank" style="overflow-wrap: anywhere;">{{ linkUrl0 }}</a>
            </div>
            <hr v-if="linkTitle1">
            <div v-if="linkTitle1" class="link_frame">
              <h5>{{ linkTitle1 }}</h5>
              <a :href="linkUrl1" target="_blank" style="overflow-wrap: anywhere;">{{ linkUrl1 }}</a>
            </div>
            <hr v-if="linkTitle2">
            <div v-if="linkTitle2" class="link_frame">
              <h5>{{ linkTitle2 }}</h5>
              <a :href="linkUrl2" target="_blank" style="overflow-wrap: anywhere;">{{ linkUrl2 }}</a>
            </div>
            <hr v-if="linkTitle3">
            <div v-if="linkTitle3" class="link_frame">
              <h5>{{ linkTitle3 }}</h5>
              <a :href="linkUrl3" target="_blank" style="overflow-wrap: anywhere;">{{ linkUrl3 }}</a>
            </div>
          </div>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import FlowScripts from '~/cadence/scripts'
import FlowTransactions from '~/cadence/transactions'

export default {
  name: 'OwnedTicketsConfirmModal',
  props: {
    ticket: {
      type: Object,
      default: () => {}
    },
    ticketWhen0: {
      type: String,
      required: true,
      default: ''
    },
    ticketTitle: {
      type: String,
      required: false,
      default: null
    },
    ticketDescription: {
      type: String,
      required: false,
      default: null
    },
    additionalDescription: {
      type: Object,
      required: false,
      default: () => {}
    },
    noLogin: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  data () {
    return {
      bloctoWalletUser: {},
      address: null,
      ticketAddress: null,
      tickets: [],
      toolList: ['Zoom', 'Instagram', 'Discord', 'Teams', 'Google Meet', 'Ticket website', 'YouTube', 'Any tool', 'On-site'],
      isBordered: false,
      isStriped: false,
      isNarrowed: false,
      isHoverable: false,
      isFocusable: false,
      isLoading: false,
      hasMobileCards: true,
      showCalendar: false,
      showMessage: false,
      showTooltip: false,
      date: new Date(),
      startTime: null,
      events: [],
      isScheduleDate: false,
      isDiscloseSales: false,
      isCardModalActive: false,
      radioInfo: 'fourth',
      isOpenCollapseFirst: false,
      isOpenCollapseSecond: false,
      isOpenCollapseThird: false,
      isOpenCollapseFourth: false,
      subTitleText0: null,
      subTitleText1: null,
      subTitleText2: null,
      subTitleText3: null,
      subTitleText4: null,
      subTitleText5: null,
      subTitleText6: null,
      subTitleText7: null,
      subTitleText8: null,
      linkTitle0: null,
      linkUrl0: null,
      linkTitle1: null,
      linkUrl1: null,
      linkTitle2: null,
      linkUrl2: null,
      linkTitle3: null,
      linkUrl3: null,
      isTop: !location.href?.includes('/ti/'),
      doUkrainianSupport: false,
      commentInput: '',
      commentEditInput: '',
      commentCount: 0,
      upvoteCount: 0,
      isUpvoted: false,
      commentUpdatable: true,
      upvoteUpdatable: true,
      allMessage: {},
      comments: [],
      commented_ids: [],
      organizer_commented_ids: [],
      updateMessageIndex: null,
      showMessageEditor: false,
      isUpdateComment: false
    }
  },
  watch: {
    date: {
      handler (val) {
        this.isScheduleDate = false
        const target = new Date(val).getTime()
        const hasEvent = this.events.find((obj) => {
          return obj.date.getTime() === target
        })
        this.showTooltip = hasEvent
        const when = this.ticket.when_to_use.split('||')
        if (when.length >= 2) {
          const scheduleDate = new Date(parseInt(when[1]))
          const targetDate = new Date(val)
          if (
            scheduleDate.getYear() === targetDate.getYear() &&
            scheduleDate.getMonth() === targetDate.getMonth() &&
            scheduleDate.getDate() === targetDate.getDate()
          ) {
            this.isScheduleDate = true
            this.showTooltip = true
          }
        }
      }
    },
    radioInfo: {
      handler (val) {
        this.isOpenCollapseFirst = false
        this.isOpenCollapseSecond = false
        this.isOpenCollapseThird = false
        this.isOpenCollapseFourth = false
        switch (val) {
          case 'first':
            this.isOpenCollapseFirst = true
            break
          case 'second':
            this.isOpenCollapseSecond = true
            break
          case 'third':
            this.isOpenCollapseThird = true
            break
          case 'fourth':
            this.isOpenCollapseFourth = true
            break
        }
      }
    },
    isOpenCollapseFirst: {
      handler (val) {
        if (val === true) {
          this.isOpenCollapseSecond = false
          this.isOpenCollapseThird = false
          this.isOpenCollapseFourth = false
          this.radioInfo = 'first'
        }
      }
    },
    isOpenCollapseSecond: {
      handler (val) {
        if (val === true) {
          this.isOpenCollapseFirst = false
          this.isOpenCollapseThird = false
          this.isOpenCollapseFourth = false
          this.radioInfo = 'second'
        }
      }
    },
    isOpenCollapseThird: {
      handler (val) {
        if (val === true) {
          this.isOpenCollapseFirst = false
          this.isOpenCollapseSecond = false
          this.isOpenCollapseFourth = false
          this.radioInfo = 'third'
        }
      }
    },
    isOpenCollapseFourth: {
      handler (val) {
        if (val === true) {
          this.isOpenCollapseFirst = false
          this.isOpenCollapseSecond = false
          this.isOpenCollapseThird = false
          this.radioInfo = 'fourth'
        }
      }
    }
  },
  mounted () {
    this.$fcl.currentUser.subscribe(this.setupWalletInfo)
    this.showComments()
    if (this.additionalDescription && this.additionalDescription.infoDetail && this.additionalDescription.infoDetail.subtitle && this.additionalDescription.infoDetail.subtitle.length) {
      const texts = this.additionalDescription.infoDetail.subtitle.split('\r\n')
      if (texts.length >= 2) {
        for (let i = 0; i < texts.length; i++) {
          switch (i) {
            case 0:
              this.subTitleText0 = texts[i]
              break
            case 1:
              this.subTitleText1 = texts[i]
              break
            case 2:
              this.subTitleText2 = texts[i]
              break
            case 3:
              this.subTitleText3 = texts[i]
              break
            case 4:
              this.subTitleText4 = texts[i]
              break
            case 5:
              this.subTitleText5 = texts[i]
              break
            case 6:
              this.subTitleText6 = texts[i]
              break
            case 7:
              this.subTitleText7 = texts[i]
              break
            default:
              if (this.subTitleText8 === null) {
                this.subTitleText8 = ''
              }
              this.subTitleText8 = this.subTitleText8 + texts[i]
          }
        }
      } else {
        this.subTitleText0 = this.additionalDescription.infoDetail.subtitle
      }
    }
    if (this.additionalDescription && this.additionalDescription.infoDetail && this.additionalDescription.infoDetail.linkTitle && this.additionalDescription.infoDetail.linkTitle.length) {
      const linkTitles = this.additionalDescription.infoDetail.linkTitle.split('\r\n')
      const linkUrls = this.additionalDescription.infoDetail.linkUrl.split('\r\n')
      if (linkTitles.length >= 2 && linkTitles.length === linkUrls.length) {
        for (let i = 0; i < linkTitles.length; i++) {
          switch (i) {
            case 0:
              this.linkTitle0 = linkTitles[i]
              this.linkUrl0 = linkUrls[i]
              break
            case 1:
              this.linkTitle1 = linkTitles[i]
              this.linkUrl1 = linkUrls[i]
              break
            case 2:
              this.linkTitle2 = linkTitles[i]
              this.linkUrl2 = linkUrls[i]
              break
            case 3:
              this.linkTitle3 = linkTitles[i]
              this.linkUrl3 = linkUrls[i]
              break
          }
        }
      } else {
        this.linkTitle0 = this.additionalDescription.infoDetail.linkTitle
        this.linkUrl0 = this.additionalDescription.infoDetail.linkUrl
      }
    }

    const ticket = {}
    const ticketName = this.ticket.name.split('||@')
    ticket.ticketName = this.ticketTitle || ticketName[0] // 多言語対応
    ticket.twitter = 'https://twitter.com/' + ticketName[1]
    ticket.twitterAccount = ticketName[1]
    ticket.ticketPrice = this.ticket.price.replace(/\.?0+$/, '')
    const when = this.ticket.when_to_use.split('||')
    if (when.length >= 2) {
      ticket.ticketWhen = new Date(parseInt(when[1])).toLocaleString().replace(/(:\d{2}):00/, '$1') + (parseInt(this.ticket.type) === 1 ? '' : ` ${this.$t('ticket_text6')} `)
      this.startTime = new Date(parseInt(when[1])).toLocaleTimeString()
      this.isDiscloseSales = when.length >= 4 && when[3].length > 10
      this.ticketAddress = when.length >= 5 ? when[4] : ''
      this.doUkrainianSupport = when.length >= 6 && when[5].length > 0 ? when[5] + '% ' + this.$t('operation_text150') : false
    }
    const where = this.ticket.where_to_use.split('||')
    let detail = ''
    let tool = ''
    if (where.length === 2) {
      tool = where[0]
      detail = where[1]
    } else if (where.length > 2) {
      tool = where[0]
      detail = ''
      for (let i = 1; i < where.length; i++) {
        detail = detail + (i === 1 ? '' : '||') + where[i]
      }
    }
    let type = this.toolList[parseInt(tool) - 1] || ''
    if (type === 'Ticket website') {
      type = 'in ' + this.$t('ticket_text2')
    } else if (type === 'Any tool') {
      type = this.$t('ticket_text3')
    } else if (type === 'On-site') {
      type = this.$t('ticket_text4')
    }
    ticket.description = this.ticketDescription || detail // 多言語対応
    ticket.type = type
    ticket.ticketWhereType = where[0]
    if (where.length === 2) {
      ticket.ticketWhere = where[1]
    } else if (where.length > 2) {
      ticket.ticketWhere = ''
      for (let i = 1; i < where.length; i++) {
        ticket.ticketWhere = ticket.ticketWhere + (i === 1 ? '' : '||') + where[i]
      }
    }
    this.tickets.push(ticket)
    if (this.noLogin) {
      this.$buefy.toast.open({
        message: this.$t('operation_text126'),
        duration: 4000,
        queue: false
      })
    }
  },
  methods: {
    async flowWalletLogin () {
      this.$buefy.snackbar.open({
        duration: 5000,
        message: this.$t('help_text18'),
        type: 'is-danger',
        position: 'is-bottom-left',
        actionText: null,
        queue: false,
        onAction: () => {
        }
      })
      await this.$fcl.authenticate()
    },
    async flowWalletLogout () {
      await this.$fcl.unauthenticate()
    },
    setupWalletInfo (user) {
      this.bloctoWalletUser = user

      if (this.bloctoWalletUser?.addr) {
        this.address = this.bloctoWalletUser?.addr
      }
    },
    async showComments () {
      try {
        const messages = await this.$fcl.send(
          [
            this.$fcl.script(FlowScripts.getMessages),
            this.$fcl.args([
            ])
          ]
        ).then(this.$fcl.decode)
        this.allMessage = messages
        if (this.allMessage?.[this.bloctoWalletUser?.addr]) {
          this.commented_ids = this.allMessage?.[this.bloctoWalletUser?.addr].commented_ids || []
        }
        this.organizer_commented_ids = this.allMessage?.[this.ticketAddress].commented_ids || []
        if (this.allMessage?.[this.ticketAddress]) {
          this.upvoteCount = parseInt(this.allMessage?.[this.ticketAddress].got_upvote)
          this.commentCount = this.allMessage?.[this.ticketAddress].got_comments.filter(obj => obj.comment !== '').length
          this.comments = this.allMessage?.[this.ticketAddress].got_comments
          this.comments.reverse()
          this.comments.forEach((obj) => {
            let i = 0
            let url = ''
            obj.comment = obj.comment.split('\n').map((data) => {
              if (data.indexOf('http') === 0 && i === 0) {
                url = data
                i++
                return '¥¥break¥¥'
              } else {
                return data
              }
            }).join('\n')
            if (url) {
              obj.url = url
              const text = obj.comment.split('¥¥break¥¥')
              obj.commentPre = text[0]
              obj.commentPost = text[1]
              obj.comment = obj.comment.replace('¥¥break¥¥', url)
            }
          })
          if (this.bloctoWalletUser?.addr) {
            const upvoteTickets = this.allMessage?.[this.bloctoWalletUser?.addr].upvote_tickets || []
            if (upvoteTickets.includes(this.ticketAddress)) {
              this.isUpvoted = true
            } else {
              this.isUpvoted = false
            }
          }
        }
      } catch (e) {
      }
    },
    async addComment (isComment, isEdit) {
      if ((this.commentUpdatable && isComment) || (this.upvoteUpdatable && !isComment)) {
        if (isComment) {
          this.commentUpdatable = false
        } else {
          this.upvoteUpdatable = false
        }
        let comment = ''
        let isDownvote = false
        if (isComment) {
          if (isEdit) {
            comment = this.commentEditInput
          } else {
            comment = this.commentInput
          }
        }
        if (!this.bloctoWalletUser.addr) {
          await this.flowWalletLogin()
        } else {
          this.$buefy.snackbar.open({
            duration: 5000, // 5 seconds
            message: this.$t('operation_text85') + '<br>' + this.$t('operation_text29'),
            type: 'is-danger',
            position: 'is-bottom-left',
            actionText: null,
            queue: false,
            onAction: () => {
            }
          })
        }
        if (this.bloctoWalletUser.addr) {
          // loading
          const loadingComponent = this.$buefy.loading.open({
            container: null
          })
          setTimeout(() => loadingComponent.close(), 3 * 1000)

          try {
            const hasMessageVault = await this.$fcl.send(
              [
                this.$fcl.script(FlowScripts.hasMessagesVault),
                this.$fcl.args([
                  this.$fcl.arg(this.bloctoWalletUser?.addr, this.$fclArgType.Address)
                ])
              ]
            ).then(this.$fcl.decode)
            if (!hasMessageVault) {
              await this.$fcl.send(
                [
                  this.$fcl.transaction(FlowTransactions.createMessage),
                  this.$fcl.args([
                    this.$fcl.arg(this.bloctoWalletUser?.addr, this.$fclArgType.Address),
                    this.$fcl.arg(this.ticketAddress, this.$fclArgType.Address),
                    this.$fcl.arg(comment, this.$fclArgType.String),
                    this.$fcl.arg(isComment, this.$fclArgType.Bool)
                  ]),
                  this.$fcl.payer(this.$fcl.authz),
                  this.$fcl.proposer(this.$fcl.authz),
                  this.$fcl.authorizations([this.$fcl.authz]),
                  this.$fcl.limit(9999)
                ]
              ).then(this.$fcl.decode)
            } else {
              const message = this.allMessage[this.bloctoWalletUser?.addr]
              if (!isComment && message && message.upvote_tickets.includes(this.ticketAddress)) {
                isDownvote = true
                const index = message.upvote_tickets.indexOf(this.ticketAddress)
                await this.$fcl.send(
                  [
                    this.$fcl.transaction(FlowTransactions.updateMessage),
                    this.$fcl.args([
                      this.$fcl.arg(this.bloctoWalletUser?.addr, this.$fclArgType.Address),
                      this.$fcl.arg(this.ticketAddress, this.$fclArgType.Address),
                      this.$fcl.arg(index, this.$fclArgType.UInt32),
                      this.$fcl.arg(comment, this.$fclArgType.String),
                      this.$fcl.arg(isComment, this.$fclArgType.Bool)
                    ]),
                    this.$fcl.payer(this.$fcl.authz),
                    this.$fcl.proposer(this.$fcl.authz),
                    this.$fcl.authorizations([this.$fcl.authz]),
                    this.$fcl.limit(9999)
                  ]
                ).then(this.$fcl.decode)
              } else if (!isEdit) {
                await this.$fcl.send(
                  [
                    this.$fcl.transaction(FlowTransactions.addMessage),
                    this.$fcl.args([
                      this.$fcl.arg(this.bloctoWalletUser?.addr, this.$fclArgType.Address),
                      this.$fcl.arg(this.ticketAddress, this.$fclArgType.Address),
                      this.$fcl.arg(comment, this.$fclArgType.String),
                      this.$fcl.arg(isComment, this.$fclArgType.Bool)
                    ]),
                    this.$fcl.payer(this.$fcl.authz),
                    this.$fcl.proposer(this.$fcl.authz),
                    this.$fcl.authorizations([this.$fcl.authz]),
                    this.$fcl.limit(9999)
                  ]
                ).then(this.$fcl.decode)
              } else {
                const index = this.updateMessageIndex
                await this.$fcl.send(
                  [
                    this.$fcl.transaction(FlowTransactions.updateMessage),
                    this.$fcl.args([
                      this.$fcl.arg(this.bloctoWalletUser?.addr, this.$fclArgType.Address),
                      this.$fcl.arg(this.ticketAddress, this.$fclArgType.Address),
                      this.$fcl.arg(index, this.$fclArgType.UInt32),
                      this.$fcl.arg(comment, this.$fclArgType.String),
                      this.$fcl.arg(isComment, this.$fclArgType.Bool)
                    ]),
                    this.$fcl.payer(this.$fcl.authz),
                    this.$fcl.proposer(this.$fcl.authz),
                    this.$fcl.authorizations([this.$fcl.authz]),
                    this.$fcl.limit(9999)
                  ]
                ).then(this.$fcl.decode)
              }
            }
            this.isUpdateComment = isComment
            // loading
            const loadingComponent2 = this.$buefy.loading.open({
              container: null
            })
            setTimeout(() => {
              loadingComponent2.close()
              this.$buefy.dialog.confirm({
                message: '<b>' + this.$t('operation_text161') + '</b><br>' + this.$t('operation_text162'),
                confirmText: this.$t('operation_text108'),
                type: 'is-info',
                hasIcon: true,
                onConfirm: () => {
                  location.href = '/dispenser/'
                }
              })
            }, 5 * 1000)
            if (isComment) {
              this.showMessage = false
              this.showMessageEditor = false
            }
            if (this.upvoteUpdatable) {
              if (isDownvote) {
                this.upvoteCount = this.upvoteCount - 1
                this.isUpvoted = false
              } else if (!isComment) {
                this.upvoteCount = this.upvoteCount + 1
                this.isUpvoted = true
              }
            }
          } catch (e) {
          }
        } else {
          setTimeout(() => {
            // 2秒後しれっと最新情報を読みに行く
            this.showComments()
          }, 2000)
        }
        setTimeout(async () => {
          // 15秒後しれっと最新情報を読みに行く
          await this.showComments()
          this.commentUpdatable = true
          this.upvoteUpdatable = true
          if (this.isUpdateComment) {
            this.$emit('updateComment')
          }
        }, 15000)
      }
    },
    nextEvent () {
      this.$emit('eventname')
    },
    showSchedule () {
      this.events = []
      if (parseInt(this.ticket.type) === 0) {
        // Mondayが0
        const weekdays = this.ticketWhen0.split('')
        const today = new Date()
        const todayTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0).getTime()
        for (let i = 0; i < 365; i++) {
          const target = new Date(todayTime + (i * 86400000))
          let nextDay = target.getDay()
          // Mondayを0にしたので合わせる
          nextDay = nextDay - 1 < 0 ? 6 : nextDay - 1
          if (weekdays.includes(nextDay.toString())) {
            this.events.push(
              {
                date: new Date(target),
                type: 'is-warning'
              }
            )
          }
        }
      }
      const when = this.ticket.when_to_use.split('||')
      if (when.length >= 2) {
        this.events.push(
          {
            date: new Date(parseInt(when[1])),
            type: 'is-link'
          }
        )
      }
      if (parseInt(this.ticket.type) === 1 && when.length >= 2) {
        const _today = new Date()
        const _todayTime = new Date(_today.getFullYear(), _today.getMonth(), _today.getDate(), 0, 0, 0).getTime()
        const endDateTime = new Date(parseInt(when[1])).getTime()
        for (let i = 0; i < 365; i++) {
          const target = new Date(_todayTime + (i * 86400000))
          if (target.getTime() < endDateTime) {
            this.events.push(
              {
                date: new Date(target),
                type: 'is-info'
              }
            )
          }
        }
      }
      this.showCalendar = true
    },
    hideSchedule () {
      this.showCalendar = false
      this.showTooltip = false
    }
  }
}
</script>

<style lang="scss" scoped>

.modal-card {
  width: auto;

  .modal-card-body {
    text-align: center;
    padding: 20px 10px;
    min-height: 420px;

    .text-wrap {
      margin: 16px;

      &.text-title {
        font-size: 18px;
      }

      p {
        color: #222;
        margin: 8px 0;
      }

      h2 {
        font-size: 18px;
      }

      p.no-requester {
        font-weight: bold;
      }

      .content-information {
        margin: 0;
        font-size: 12px;

        .col1 {
          margin-left: 1%;
        }

        .col2 {
          margin-left: 5%;
        }

        .col3 {
          margin-left: 30%;
        }

        .col4 {
          margin-right: 1%;
          display: block;
          float: right;
        }
      }
      .requester-list {
        li {
          position: relative;
          display: flex;
          animation: fadeIn 0.5s linear;
          animation-fill-mode: both;
          background-color: #fff;
          border-top: none;
          border-bottom: 1.5px solid #222;

          &:nth-child(1) {
            border-top: 1.5px solid #222;
          }

          div {
            border-left: 1.5px solid #222;
            border-right: 1.5px solid #222;
            padding: 7px;
            color: #222;
            font-size: 16px;
            font-weight: bold;
          }

          .dispenser-id {
            width: 10%;
            border-right: none;
          }

          .requester-address {
            width: 40%;
            border-right: none;
          }

          .address {
            color: #0089c7;

            &:visited {
              color: #A766ff;
            }
          }

          .requester-domain {
            width: 36%;
            border-right: none;
          }

          .payed-block {
            width: 14%;
            text-align: right;
          }

          .purple {
            color: purple;
          }
        }
      }
    }
  }

  p.link_frame {
    margin-top: 40px;
  }
}
</style>
